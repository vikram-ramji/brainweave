"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/lib/authClient";

export default function Home() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to Brainweave</h1>
        <p>Please sign in to continue.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Brainweave</h1>
      <p>Signed in as {session?.user?.email}</p>
      <Button
        onClick={() => {
          authClient.signOut();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
