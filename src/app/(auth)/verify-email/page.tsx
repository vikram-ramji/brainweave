import AuthCard from "@/modules/auth/components/AuthCard";
import { Button } from "@/components/ui/button";
import { auth } from "@/modules/auth/lib/auth";
import { CheckCircle, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

export default async function VerifyEmailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthCard variant="verify-email">
      <div className="flex flex-col items-center text-center space-y-6 p-4">
        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Check Your Email</h2>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Didn&apos;t receive the email? Check your spam folder.</span>
          </div>
        </div>
        {/* TODO: Add resend email functionality */}

        <Button variant="outline" asChild className="w-full">
          <Link href="/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
