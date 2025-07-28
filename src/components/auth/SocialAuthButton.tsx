import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SocialButtonProps } from "@/types/SocialButtonProps";

interface SocialAuthButtonProps extends SocialButtonProps {
  provider: "google" | "github";
  icon: React.ReactNode;
  label: string;
}

export default function SocialAuthButton({
  provider,
  icon,
  label,
  isSubmitting,
  setIsSubmitting,
}: SocialAuthButtonProps) {
  const handleSocialAuth = async () => {
    await authClient.signIn.social(
      {
        provider,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
        },
        onResponse: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      className={cn("w-full gap-2 cursor-pointer dark:text-slate-200")}
      disabled={isSubmitting}
      onClick={handleSocialAuth}
    >
      {icon}
      {label}
    </Button>
  );
}
