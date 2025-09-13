import { useTRPC } from "@/trpc/client";
import { useRouter } from "@bprogress/next/app";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateNote = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.notes.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: data.id }).queryKey,
          { ...data, tags: [] },
        );
        router.push(`/notes/${data.id}`);
      },
      onError: () => {
        toast.error("Failed to create note");
      },
    }),
  );
};
