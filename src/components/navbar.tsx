"use client";
import Logo from "@/assets/logo";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Session, User } from "better-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModeToggle } from "./modeToggle";

export default function Navbar({
  session,
}: {
  session: { user: User; session: Session } | null;
}) {
  const user = session?.user;
  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut();
    toast.success("You have been signed out.");
    router.replace("/");
    router.refresh();
  };

  return (
    <nav className="p-2 sticky">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"}>
          <div className="flex items-center space-x-1">
            <Logo className="w-5 h-5"/>
            <span className="text-slate-950 text-lg font-bold dark:text-slate-100">
              Brainweave
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <Button variant={"ghost"} className="cursor-pointer" onClick={handleSignout}>
              Sign Out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button variant={"ghost"} className="cursor-pointer bg-background">Sign In</Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
