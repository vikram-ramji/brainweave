import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import GithubIcon from "@/assets/githubIcon";
import { SocialButtonProps } from "@/types/SocialButtonProps";

export default function GithubAuthButton({ isSubmitting, setIsSubmitting }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full gap-2 cursor-pointer dark:text-slate-200")}
      disabled={isSubmitting}
      onClick={async () => {
        await authClient.signIn.social(
          {
            provider: "github",
            callbackURL: "/dashboard",
          },
          {
            onRequest: (ctx) => {
              setIsSubmitting(true);
            },
            onResponse: (ctx) => {
              setIsSubmitting(false);
            },
          }
        );
      }}
    >
      <GithubIcon />
      Sign in with Github
    </Button>
  );
}
