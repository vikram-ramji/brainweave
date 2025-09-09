import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  redirect("/notes");

  return <div>dashboard</div>;
}
// TODO: Implement the dashboard page functionality
