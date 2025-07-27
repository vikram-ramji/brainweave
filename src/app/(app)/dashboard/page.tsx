import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { NotesList } from "@/components/notes/NotesList";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <AppHeader session={session} title="Dashboard" />
      <NotesList />
    </div>
  );
}
