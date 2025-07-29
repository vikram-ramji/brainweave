"use client";

import { CreateNoteInput, CreateNoteSchema } from "@/schemas/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react";
import { UserSession } from "@/types/UserSession";
import { AppHeader } from "../app/AppHeader";
import { useTagManagement } from "@/hooks/use-tag-management";
import { TagManager } from "./TagManager";
import { NoteTitleField } from "./NoteTitleField";

export default function NoteCreateForm({ session }: { session: UserSession }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [] },
      textContent: "",
      tagIds: [],
    },
  });

  const tagManagement = useTagManagement({
    form: register,
  });

  // Fetch tags on component mount
  useEffect(() => {
    tagManagement.fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagManagement.fetchTags]);

  const onSubmit = async (inputData: z.infer<typeof CreateNoteSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axios.post("/api/notes", inputData);

      if (response.success) {
        toast.success("Note created successfully!");
        router.push(`/dashboard`);
        router.refresh();
      } else {
        toast.error("Failed to create note");
      }
    } catch {
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
          <NoteTitleField control={register.control} name="title" />

          <TagManager
            currentTags={tagManagement.currentTags}
            availableTagsFiltered={tagManagement.availableTagsFiltered}
            newTagName={tagManagement.newTagName}
            setNewTagName={tagManagement.setNewTagName}
            isCreatingTag={tagManagement.isCreatingTag}
            onCreateTag={tagManagement.createTag}
            onRemoveTag={tagManagement.removeTag}
            onAddExistingTag={tagManagement.addExistingTag}
          />

          <div className="flex-1 bg-background border-b">
            <SimpleEditor onUpdate={handleEditorUpdate} />
          </div>
        </form>
      </Form>
    </div>
  );
}
