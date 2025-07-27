import React from 'react'
import { Button } from '../ui/button';
import GoogleIcon from '@/assets/googleIcon';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { SocialButtonProps } from '@/types/SocialButtonProps';

export default function GoogleAuthButton({ isSubmitting, setIsSubmitting }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full gap-2 cursor-pointer dark:text-slate-200")}
      disabled={isSubmitting}
      onClick={async () => {
        await authClient.signIn.social({
            provider: "google",
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
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
