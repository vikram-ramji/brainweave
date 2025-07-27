import { AppHeader } from "@/components/app/AppHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NoteCreateForm from "@/components/notes/NoteCreateForm";

export default async function CreateNote() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col flex-1 bg-background h-full z-20">
      <NoteCreateForm session={session} />
    </div>
  );
}
