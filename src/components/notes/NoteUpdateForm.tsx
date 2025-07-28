"use client";

import { UpdateNoteInput, UpdateNoteSchema } from "@/schemas/notes";
import { UserSession } from "@/types/UserSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tiptap/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AppHeader } from "../app/AppHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X, Plus } from "lucide-react";
import { Tag } from "@/generated/prisma";

export default function NoteForm({
  session,
  noteId,
}: {
  session: UserSession;
  noteId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const register = useForm<UpdateNoteInput>({
    resolver: zodResolver(UpdateNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      textContent: "",
      tagIds: [],
    },
  });

  // Watch tagIds to display current tags
  const watchedTagIds = register.watch("tagIds");

  // Get current selected tags from available tags
  // If availableTags is not loaded yet, create placeholder tags from IDs
  const currentTags: (Tag | { id: string; name: string })[] =
    watchedTagIds?.map((tagId) => {
      const foundTag = availableTags.find((tag) => tag.id === tagId);
      return (
        foundTag || { id: tagId, name: `Loading tag ${tagId.slice(0, 8)}...` }
      );
    }) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch both note and tags in parallel
        const [noteResponse, tagsResponse] = await Promise.all([
          axios.get(`/api/notes/${noteId}`),
          axios.get("/api/tags"),
        ]);

        if (noteResponse.data.success) {
          console.log("Fetched note:", noteResponse.data.data);
          const noteData = noteResponse.data.data;

          // Transform the note data to extract tagIds from tags array
          const formData = {
            ...noteData,
            tagIds: noteData.tags?.map((tag: Tag) => tag.id) || [],
          };

          register.reset(formData);
        }

        if (tagsResponse.data.success) {
          setAvailableTags(tagsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load note or tags");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [noteId, register]);

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
        setHasChanged(true);
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
    setHasChanged(true);
  };

  const addExistingTag = (tag: Tag) => {
    const currentTagIds = register.getValues("tagIds") || [];
    if (!currentTagIds.includes(tag.id)) {
      register.setValue("tagIds", [...currentTagIds, tag.id]);
      setHasChanged(true);
    }
  };

  const onSubmit = async (inputData: z.infer<typeof UpdateNoteSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axios.put(
        `/api/notes/${noteId}`,
        inputData
      );

      if (response.success) {
        toast.success("Note Updated successfully!");
        router.push(`/note/${response.data.id}`);
      } else {
        toast.error("Failed to Update note");
      }
    } catch (error) {
      toast.error("An error occurred while updating the note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorUpdate = ({ editor }: { editor: Editor }) => {
    setHasChanged(true);
    register.setValue("content", editor.getJSON());
    register.setValue("textContent", editor.getText());
  };

  return (
    <div>
      <AppHeader
        session={session}
        withSubmitButton
        isSubmitting={isSubmitting}
        hasChanged={hasChanged}
      />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading note...</p>
          </div>
        </div>
      ) : (
        <Form {...register}>
          <form
            id="note-form"
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
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setHasChanged(true);
                      }}
                      className="w-full text-4xl md:text-4xl text-center placeholder:text-4xl dark:text-4xl leading-tight h-auto py-2 px-4 font-serif focus-visible:border-0 focus-visible:ring-0 border-0 bg-background dark:bg-background"
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
                        disabled={tag.name.startsWith("Loading")} // Disable for loading tags
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
              <SimpleEditor
                key={`editor-${noteId}-${JSON.stringify(register.getValues("content"))}`}
                initialContent={register.getValues("content")}
                onUpdate={handleEditorUpdate}
              />
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
