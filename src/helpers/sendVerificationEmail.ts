import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Session } from "@/lib/auth-client";

/**
 * Helper function to send a verification email to the user.
 * @returns Promise<ApiResponse> object.
 */
export async function sendVerificationEmail(url: string, user: Session): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Brainweave | Verification email",
      react: VerificationEmail({url, name: user.name}),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification mail", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
