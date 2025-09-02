"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import dynamic from "next/dynamic";
import { Value } from "platejs";
import { Textarea } from "@/components/ui/textarea";
import { usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import TagInput from "@/modules/tags/components/TagInput";

const PlateEditor = dynamic(() => import("@/components/editor/PlateEditor"), {
  ssr: false,
});

export default function NoteEditor({ noteId }: { noteId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: note } = useSuspenseQuery(
    trpc.notes.getOne.queryOptions({ id: noteId }),
  );
  const { data: tags } = useSuspenseQuery(trpc.tags.getAll.queryOptions());

  const [title, setTitle] = useState(note.title);

  const updateNote = useMutation(
    trpc.notes.update.mutationOptions({
      onMutate: async (newNote) => {
        await queryClient.cancelQueries({
          queryKey: trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
        });
        const prevNote = queryClient.getQueryData(
          trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
        );
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
          (oldNote) =>
            oldNote
              ? {
                  ...oldNote,
                  ...newNote,
                }
              : oldNote,
        );

        return { prevNote };
      },
      onSuccess: (updatedNote) => {
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
          updatedNote,
        );
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
      },
      onError: (_err, _newNote, ctx) => {
        if (ctx?.prevNote) {
          queryClient.setQueryData(
            trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
            ctx.prevNote,
          );
        }
      },
    }),
  );

  const debouncedTitleSave = useDebouncedCallback((newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    updateNote.mutate({
      id: noteId,
      title: trimmedTitle === "" ? "Untitled" : trimmedTitle,
    });
  }, 1000);

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    debouncedTitleSave(e.target.value);
  };

  const editor = usePlateEditor({
    plugins: EditorKit,
    id: noteId,
    value: note.content as Value,
  });

  const debouncedSaveContent = useDebouncedCallback((value, textContent) => {
    updateNote.mutate({ id: noteId, content: value, textContent });
  }, 2000);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const lastNode = editor.children[editor.children.length - 1];
      editor.tf.select(lastNode, { edge: "end", focus: true });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="w-full flex flex-col flex-1">
        <div className="relative flex flex-col justify-end sm:min-h-30 px-16 sm:px-[max(64px,calc(50%-350px))] mt-20">
          <div className="flex justify-between max-w-full">
            <Textarea
              value={title === "Untitled" ? "" : title}
              onChange={handleTitleChange}
              onBlur={() => debouncedTitleSave.flush()}
              onKeyDown={handleTitleKeyDown}
              className=" lg:text-4xl md:text-3xl text-2xl font-bold !bg-transparent w-full border-0 focus-visible:border-0 focus-visible:ring-0 px-0 shadow-none shrink-0 resize-none"
              placeholder="Add a title"
              maxLength={100}
            />
          </div>
          <div>
            <TagInput userTags={tags} noteTags={note.tags} noteId={note.id} />
          </div>
        </div>
        <div className="flex-1">
          <PlateEditor editor={editor} onChange={debouncedSaveContent} />
        </div>
      </div>
    </div>
  );
}
