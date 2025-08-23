"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Value } from "platejs";
import { Badge } from "@/components/ui/badge";

const PlateEditor = dynamic(() => import("@/components/editor/PlateEditor"), {
  ssr: false,
});

export default function NoteEditor({ noteId }: { noteId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: note } = useSuspenseQuery(
    trpc.notes.getOne.queryOptions({ id: noteId }),
  );

  const [title, setTitle] = useState(note.title);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const updateNote = useMutation(
    trpc.notes.update.mutationOptions({
      onMutate: async (newNote) => {
        setStatus("saving");
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
          queryKey: trpc.notes.getMany.queryOptions().queryKey,
        });
        setStatus("saved");
      },
      onError: (_err, _newNote, ctx) => {
        if (ctx?.prevNote) {
          queryClient.setQueryData(
            trpc.notes.getOne.queryOptions({ id: noteId }).queryKey,
            ctx.prevNote,
          );
        }
        setStatus("idle");
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

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedTitleSave(e.target.value);
  };

  const debouncedSaveContent = useDebouncedCallback((value, textContent) => {
    updateNote.mutate({ id: noteId, content: value, textContent });
  }, 2000);

  return (
    <div className="flex h-full flex-col">
      <div className="w-full flex flex-col flex-1">
        <div className=" relative flex flex-col justify-end sm:min-h-30 px-16 sm:px-[max(64px,calc(50%-350px))]">
          <div className="flex justify-between max-w-full">
            <Input
              type="text"
              value={title === "Untitled" ? "" : title}
              onChange={handleTitleChange}
              onBlur={() => debouncedTitleSave.flush()}
              className="md:text-5xl font-bold bg-transparent! w-full border-0 focus-visible:border-0 focus-visible:ring-0 px-0 shrink-0"
              placeholder="Add a title"
            />
            {status !== "idle" && (
              <Badge variant={"outline"}>
                {status === "saving" ? "Saving…" : "Saved"}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-2 flex-1">
          <PlateEditor
            initialContent={note.content as Value}
            onChange={debouncedSaveContent}
          />
        </div>
      </div>
    </div>
  );
}
