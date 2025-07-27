import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Trash } from "lucide-react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import getLastUpdated from "@/helpers/getLastUpdated";
import { NoteWithTags } from "@/types/NoteWithTags";
import TagBadges from "../tags/TagBadges";

type NoteCardProps = {
  note: NoteWithTags;
  onNoteDelete: (noteId: string) => void;
};

export default function NoteCard({ note, onNoteDelete }: NoteCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/notes/${note.id}`);
    toast(response.data.message);
    onNoteDelete(note.id);
  };

  const lastUpdated = getLastUpdated(note.updatedAt);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>Last updated at - {lastUpdated}</CardDescription>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
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
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {note.textContent.slice(0, 100)}...
        </p>
      </CardContent>
      <CardFooter>
        <TagBadges tags={note.tags} limit={3} />
      </CardFooter>
    </Card>
  );
}
