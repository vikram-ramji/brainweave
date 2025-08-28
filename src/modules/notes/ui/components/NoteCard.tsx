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
} from "@/components/ui/card";
import { Loader2, Trash } from "lucide-react";
import getLastUpdated from "@/utils/getLastUpdated";
import Link from "next/link";
import { Note } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

type NoteCardProps = {
  note: Note;
};

export default function NoteCard({ note }: NoteCardProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isNoteUpdated = note.updatedAt > note.createdAt;

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleNoteDelete = () => {
    deleteNote.mutate({ id: note.id });
  };

  return (
    <Link
      href={`/notes/${encodeURIComponent(note.id)}`}
      key={note.id}
      className="h-full"
    >
      <Card className="relative z-20 h-50 w-full overflow-hidden flex flex-col group">
        <CardHeader>
          <CardTitle className="line-clamp-2">{note.title}</CardTitle>
          <CardDescription>
            {`${isNoteUpdated ? "Last updated" : "Created"}: ${getLastUpdated(note.updatedAt)}`}
          </CardDescription>
          <CardAction
            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
            onClick={handleDeleteClick}
          >
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
          <p className="whitespace-pre-line line-clamp-4">
            {note.textContent.substring(0, 100)}...
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
