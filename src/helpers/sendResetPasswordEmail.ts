import { resend } from "@/lib/resend";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Session } from "@/lib/auth-client";

/**
 * Helper function to send a Reset-Password email to the user.
 * @returns Promise<ApiResponse> object.
 */
export async function sendResetPasswordEmail(
  url: string,
  user: Session
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Brainweave | Reset-Password email",
      react: ResetPasswordEmail({ url, name: user.name }),
    });
    return {
      success: true,
      status: 200,
      message: "Reset-Password email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending Reset-Password mail", emailError);
    return {
      success: false,
      status: 500,
      message: "Failed to send Reset-Password email",
    };
  }
}
