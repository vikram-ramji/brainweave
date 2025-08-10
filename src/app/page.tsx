"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/lib/authClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Brainweave</h1>
      <p>Signed in as {session?.user?.email ?? "Guest"}</p>
      {session && (
        <Button
          onClick={() => {
            authClient.signOut();
          }}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}
