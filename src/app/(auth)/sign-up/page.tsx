import SignupForm from "@/components/auth/SignupForm";
import UnauthenticatedPageWrapper from "@/components/auth/UnauthenticatedPageWrapper";

export default async function Signup() {
  return (
    <UnauthenticatedPageWrapper>
      <SignupForm />
    </UnauthenticatedPageWrapper>
  );
}
