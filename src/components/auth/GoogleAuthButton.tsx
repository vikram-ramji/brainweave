import GoogleIcon from "@/assets/googleIcon";
import { SocialButtonProps } from "@/types/SocialButtonProps";
import SocialAuthButton from "./SocialAuthButton";

export default function GoogleAuthButton({
  isSubmitting,
  setIsSubmitting,
}: SocialButtonProps) {
  return (
    <SocialAuthButton
      provider="google"
      icon={<GoogleIcon />}
      label="Sign in with Google"
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}
