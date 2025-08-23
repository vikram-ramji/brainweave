import AuthCard from "@/modules/auth/components/AuthCard";
import SignInForm from "@/modules/auth/components/SignInForm";
import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthCard variant="signin">
      <SignInForm />
    </AuthCard>
  );
}
