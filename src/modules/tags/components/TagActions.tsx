import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, PenIcon, Trash } from "lucide-react";
import { Tag } from "../types";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@bprogress/next/app";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InsertTagSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "motion/react";

export default function TagActions({ tag }: { tag: Tag }) {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof InsertTagSchema>>({
    resolver: zodResolver(InsertTagSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  const tagName = form.watch("name");

  const updateTag = useMutation(
    trpc.tags.update.mutationOptions({
      onSuccess: (updatedTag) => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
        queryClient.setQueryData(
          trpc.tags.getOne.queryOptions({ id: tag.id }).queryKey,
          updatedTag,
        );
        queryClient.setQueryData(
          trpc.tags.getAll.queryOptions().queryKey,
          (oldTags) =>
            oldTags
              ? oldTags.map((t) => (t.id === updatedTag.id ? updatedTag : t))
              : oldTags,
        );
        router.push(`/tags/${updatedTag.name}`);
      },
    }),
  );

  const deleteTag = useMutation(
    trpc.tags.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.tags.getAll.queryOptions().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
      },
    }),
  );

  const handleTagUpdate = () => {
    updateTag.mutate({ id: tag.id, name: tagName });
    setOpen(false);
  };

  const handleTagDelete = () => {
    deleteTag.mutate({ id: tag.id });
    setOpen(false);
  };

  return (
    <AlertDialog>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-5"
          >
            <PenIcon className="size-4" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent sideOffset={10}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleTagUpdate)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    tagName.trim() === "" ||
                    tagName === tag.name ||
                    updateTag.isPending
                  }
                >
                  Save
                </Button>
                <AlertDialogTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="text-muted-foreground"
                  >
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
              </div>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your tag
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTag.isPending}
            onClick={handleTagDelete}
          >
            {deleteTag.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
