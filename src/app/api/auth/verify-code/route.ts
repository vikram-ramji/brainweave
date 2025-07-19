import { ErrorResponse, SuccessResponse } from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, code } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error("User doesn't exist, sign up!");
      return ErrorResponse("User doesn't exist, sign up!", 400);
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (isCodeValid && !isCodeExpired) {
      await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });
      return SuccessResponse("Account verified successfully");
    } else if (isCodeExpired) {
      return ErrorResponse("Verification code expired! Sign-up again", 400);
    } else {
      return ErrorResponse("Invalid code, try again", 400);
    }
  } catch (error) {
    console.error("Error verifying user");
    return ErrorResponse("Error verifying user", 500);
  }
};
