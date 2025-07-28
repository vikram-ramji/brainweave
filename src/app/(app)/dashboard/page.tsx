import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { NotesList } from "@/components/notes/NotesList";
import getServerSession from "@/app/lib/getServerSession";
import fetchNotes from "@/helpers/fetchNotes";
import { InfiniteData } from "@tanstack/react-query";
import { NotesWithPagination } from "@/types/NotesApi";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <AppHeader session={session} />
      <NotesList/>
    </div>
  );
}
