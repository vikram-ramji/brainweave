import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/modules/auth/lib/authClient";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SocialAuthButtons({ pending }: { pending: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        disabled={pending}
        onClick={() => {
          authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
          });
        }}
        variant="outline"
        type="button"
        className="w-full"
      >
        <FaGoogle />
      </Button>
      <Button
        disabled={pending}
        onClick={() => {
          authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
          });
        }}
        variant="outline"
        type="button"
        className="w-full"
      >
        <FaGithub />
      </Button>
    </div>
  );
}
