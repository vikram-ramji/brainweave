import GithubIcon from "@/assets/githubIcon";
import { SocialButtonProps } from "@/types/SocialButtonProps";
import SocialAuthButton from "./SocialAuthButton";

export default function GithubAuthButton({
  isSubmitting,
  setIsSubmitting,
}: SocialButtonProps) {
  return (
    <SocialAuthButton
      provider="github"
      icon={<GithubIcon />}
      label="Sign in with Github"
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}
