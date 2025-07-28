import { redirect } from "next/navigation";
import NoteCreateForm from "@/components/notes/NoteCreateForm";
import getServerSession from "@/app/lib/getServerSession";

export default async function CreateNotePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col flex-1 bg-background h-full z-20">
      <NoteCreateForm session={session} />
    </div>
  );
}
