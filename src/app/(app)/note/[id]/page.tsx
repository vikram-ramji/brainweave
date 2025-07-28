import getServerSession from "@/app/lib/getServerSession";
import NoteUpdateForm from "@/components/notes/NoteUpdateForm";
import { redirect } from "next/navigation";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  return (
    <div className="flex flex-col flex-1 bg-background h-full z-20">
      <NoteUpdateForm session={session} noteId={id} />
    </div>
  );
}
