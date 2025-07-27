"use client";
import Logo from "@/assets/logo";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="p-2 sticky top-0 w-full border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/dashboard"}>
          <div className="flex items-center space-x-1">
            <Logo className="w-5 h-5" />
            <span className="text-slate-950 text-lg font-bold dark:text-slate-100">
              Brainweave
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href={"/sign-in"}>
            <Button variant={"outline"} className="cursor-pointer">
              Sign In
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
