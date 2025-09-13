import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteNote = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.notes.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
        toast.success("Note deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete note");
      },
    }),
  );
};
