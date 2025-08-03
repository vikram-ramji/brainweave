import VerificationEmailTemplate from "@/components/emails/EmailVerification";
import resend from "@/lib/resend";
import { User } from "better-auth";

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Brainweave | Verification Email",
      react: VerificationEmailTemplate({ url, name: user.name }),
    });
    return {
      success: true,
      status: 200,
      message: "Verification email sent successfully",
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: "Failed to send verification email",
    };
  }
}
