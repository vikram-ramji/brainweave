import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthCard variant="signin">
      <SignInForm />
    </AuthCard>
  );
}
