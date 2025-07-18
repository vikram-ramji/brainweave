import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

/**
 * Helper function to send a verification email to the user.
 * @param email User's email.
 * @param username User's username.
 * @param verifyCode User's verification code.
 * @returns Promise<ApiResponse> object.
 */
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Brainweave | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification mail", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
