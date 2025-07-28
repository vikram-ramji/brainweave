"use client";

import { CreateNoteInput, CreateNoteSchema } from "@/schemas/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X, Plus } from "lucide-react";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react";
import { UserSession } from "@/types/UserSession";
import { AppHeader } from "../app/AppHeader";
import { Tag } from "@/generated/prisma";
import TagBadges from "../tags/TagBadges";

export default function NoteCreateForm({ session }: { session: UserSession }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const register = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [] },
      textContent: "",
      tagIds: [],
    },
  });

  // Watch tagIds to display current tags
  const watchedTagIds = register.watch("tagIds");

  // Get current selected tags from available tags
  const currentTags: Tag[] = availableTags.filter((tag) =>
    watchedTagIds?.includes(tag.id)
  );

  // Fetch existing tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      if (response.data.success) {
        setAvailableTags(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreatingTag(true);
    try {
      const response = await axios.post("/api/tags", {
        name: newTagName.trim(),
      });
      if (response.data.success) {
        const newTag = response.data.data;
        setAvailableTags((prev) => [...prev, newTag]);

        // Add the new tag to the form
        const currentTagIds = register.getValues("tagIds") || [];
        register.setValue("tagIds", [...currentTagIds, newTag.id]);

        setNewTagName("");
        toast.success("Tag created and added!");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const removeTag = (tagId: string) => {
    const currentTagIds = register.getValues("tagIds") || [];
    register.setValue(
      "tagIds",
      currentTagIds.filter((id) => id !== tagId)
    );
  };

  const addExistingTag = (tag: Tag) => {
    const currentTagIds = register.getValues("tagIds") || [];
    if (!currentTagIds.includes(tag.id)) {
      register.setValue("tagIds", [...currentTagIds, tag.id]);
    }
  };

  const onSubmit = async (inputData: z.infer<typeof CreateNoteSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axios.post("/api/notes", inputData);

      if (response.success) {
        toast.success("Note created successfully!");
        router.push(`/note/${response.data.id}`);
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      toast.error("An error occurred while creating the note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorUpdate = ({ editor }: { editor: Editor }) => {
    register.setValue("content", editor.getJSON());
    register.setValue("textContent", editor.getText());
  };

  return (
    <div>
      <AppHeader
        session={session}
        withSubmitButton
        isSubmitting={isSubmitting}
        isCreateMode={true}
      />
      <Form {...register}>
        <form
          id="note-create-form"
          onSubmit={register.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <FormField
            control={register.control}
            name="title"
            render={({ field }) => (
              <FormItem className="p-4 border-b">
                <FormControl>
                  <Input
                    className="w-full text-4xl md:text-4xl text-center placeholder:text-4xl dark:text-4xl leading-tight h-auto py-2 px-4 font-serif focus-visible:border-0 focus-visible:ring-0 border-0 bg-background dark:bg-background"
                    {...field}
                    placeholder="Title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags Section */}
          <div className="p-4 border-b space-y-3">
            {/* Current Tags */}
            <div className="flex flex-wrap gap-2">
              {currentTags.length > 0 ? (
                currentTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No tags added yet
                </p>
              )}
            </div>

            {/* Create New Tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Create new tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={createTag}
                disabled={!newTagName.trim() || isCreatingTag}
                size="sm"
              >
                <Plus className="h-4 w-4" />
                {isCreatingTag ? "Creating..." : "Add"}
              </Button>
            </div>

            {/* Existing Tags */}
            {availableTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Available tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => !watchedTagIds?.includes(tag.id))
                    .map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => addExistingTag(tag)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-background border-b">
            <SimpleEditor onUpdate={handleEditorUpdate} />
          </div>
        </form>
      </Form>
    </div>
  );
}
