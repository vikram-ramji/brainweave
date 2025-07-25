import { toast } from "sonner";
import SignupForm from "@/components/auth/SignupForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <SignupForm />
      
    </div>
  );
}
