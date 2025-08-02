import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthCard variant="signup">
      <SignUpForm />
    </AuthCard>
  );
}
