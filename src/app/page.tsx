import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Brainweave</h1>
    </div>
  );
}
