import AuthCard from "@/modules/auth/components/AuthCard";
import SignUpForm from "@/modules/auth/components/SignUpForm";
import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthCard variant="signup">
      <SignUpForm />
    </AuthCard>
  );
}
