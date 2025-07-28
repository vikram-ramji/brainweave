import SigninForm from "@/components/auth/SigninForm";
import UnauthenticatedPageWrapper from "@/components/auth/UnauthenticatedPageWrapper";

export default async function SignIn() {
  return (
    <UnauthenticatedPageWrapper>
      <SigninForm />
    </UnauthenticatedPageWrapper>
  );
}
