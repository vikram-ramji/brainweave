import { useTRPC } from "@/trpc/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateNote = (noteId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
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
};
