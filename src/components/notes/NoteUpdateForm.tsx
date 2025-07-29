"use client";

import { UpdateNoteInput, UpdateNoteSchema } from "@/schemas/notes";
import { UserSession } from "@/types/UserSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tiptap/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AppHeader } from "../app/AppHeader";
import { Form } from "../ui/form";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Tag } from "@/generated/prisma";
import { useTagManagement } from "@/hooks/use-tag-management";
import { TagManager } from "./TagManager";
import { NoteTitleField } from "./NoteTitleField";

export default function NoteForm({
  session,
  noteId,
}: {
  session: UserSession;
  noteId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
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

  const tagManagement = useTagManagement({
    form: register,
    onTagChange: () => setHasChanged(true),
  });

  // Get current selected tags with loading state support
  const currentTags: (Tag | { id: string; name: string })[] =
    tagManagement.currentTags.length > 0
      ? tagManagement.currentTags
      : register.watch("tagIds")?.map((tagId: string) => {
          const foundTag = tagManagement.availableTags.find(
            (tag) => tag.id === tagId
          );
          return (
            foundTag || {
              id: tagId,
              name: `Loading tag ${tagId.slice(0, 8)}...`,
            }
          );
        }) || [];

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch both note and tags in parallel
      const [noteResponse, tagsResponse] = await Promise.all([
        axios.get(`/api/notes/${noteId}`),
        axios.get("/api/tags"),
      ]);

      if (noteResponse.data.success) {
        const noteData = noteResponse.data.data;

        // Transform the note data to extract tagIds from tags array
        const formData = {
          ...noteData,
          tagIds: noteData.tags?.map((tag: Tag) => tag.id) || [],
        };

        register.reset(formData);
      }

      if (tagsResponse.data.success) {
        tagManagement.setAvailableTags(tagsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load note or tags");
    } finally {
      setIsLoading(false);
    }
  }, [noteId, register, tagManagement.setAvailableTags]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    } catch {
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
            <NoteTitleField
              control={register.control}
              name="title"
              onChange={() => setHasChanged(true)}
            />

            <TagManager
              currentTags={currentTags}
              availableTagsFiltered={tagManagement.availableTagsFiltered}
              newTagName={tagManagement.newTagName}
              setNewTagName={tagManagement.setNewTagName}
              isCreatingTag={tagManagement.isCreatingTag}
              onCreateTag={tagManagement.createTag}
              onRemoveTag={tagManagement.removeTag}
              onAddExistingTag={tagManagement.addExistingTag}
              showLoadingState={true}
            />

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
