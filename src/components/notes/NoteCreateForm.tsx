"use client";

import { CreateNoteInput, CreateNoteSchema } from "@/schemas/notes";
import { ApiDataResponse } from "@/types/ApiResponse";
import { NoteWithTags } from "@/types/NoteWithTags";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react";
import { UserSession } from "@/types/UserSession";
import { AppHeader } from "../app/AppHeader";

export default function NoteCreateForm({ session }: { session: UserSession }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const register = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [] },
      textContent: "",
      tagIds: [],
    },
  });

  const onSubmit = async (inputData: z.infer<typeof CreateNoteSchema>) => {
    setIsSubmitting(true);
    try {
      const response: ApiDataResponse<NoteWithTags> = await axios.post(
        "/api/notes",
        inputData
      );

      if (response.success) {
        toast.success("Note created successfully!");
        router.push(`/notes/${response.data.id}`);
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
          <div className="flex-1 bg-background border-b">
            <SimpleEditor onUpdate={handleEditorUpdate} />
          </div>
        </form>
      </Form>
    </div>
  );
}
