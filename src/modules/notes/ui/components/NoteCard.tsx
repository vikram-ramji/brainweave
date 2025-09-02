"use client";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Trash } from "lucide-react";
import getLastUpdated from "@/utils/getLastUpdated";
import Link from "next/link";
import { Note } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type NoteCardProps = {
  note: Note;
};

export default function NoteCard({ note }: NoteCardProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updatedAt = note.updatedAt;
  const createdAt = note.createdAt;
  const isNoteUpdated = updatedAt.getTime() > createdAt.getTime();

  const deleteNote = useMutation(
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

  const handleNoteDelete = () => {
    deleteNote.mutate({ id: note.id });
  };

  return (
    <Card
      key={note.id}
      className="relative z-20 h-55 w-full overflow-hidden flex flex-col group border-primary/40"
    >
      <Link
        href={`/notes/${encodeURIComponent(note.id)}`}
        className="absolute inset-0 z-10"
        aria-label={`View note: ${note.title}`}
      />
      <CardHeader>
        <CardTitle className="line-clamp-2">{note.title}</CardTitle>
        <CardDescription>
          {`${isNoteUpdated ? "Last updated" : "Created"}: ${getLastUpdated(note.updatedAt)}`}
        </CardDescription>
        <CardAction className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-20">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your note and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleteNote.isPending}
                  onClick={handleNoteDelete}
                >
                  {deleteNote.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="whitespace-pre-line line-clamp-2">
          {note.textContent.substring(0, 100)}...
        </p>
      </CardContent>
      <CardFooter>
        {note.tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="z-20"
          >
            <Badge className="mr-2">{tag.name}</Badge>
          </Link>
        ))}
      </CardFooter>
    </Card>
  );
}
