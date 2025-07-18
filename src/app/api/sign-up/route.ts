import { prisma } from "@/lib/db";
import { SignupInputSchema } from "@/schemas/auth/signup";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/helpers/sendApiResponse";

export async function POST(request: NextRequest) {
  try {
    const inputData = await request.json();
    const parsed = SignupInputSchema.safeParse(inputData);

    if (!parsed.success) {
      console.error("Invalid Email or Password provided");
      return sendErrorResponse("Error registering user", 400);
    }

    const { email, password, username } = parsed.data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUser) {
      if (existingUser.isVerified) {
        return sendErrorResponse("User already exists with this email", 400);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 3600000),
          },
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password,
          verifyCode,
          verifyCodeExpiry: expiryDate,
        },
      });
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return sendErrorResponse(emailResponse.message, 500);
    }

    return sendSuccessResponse(
      "User registered successfully. Please verify your email",
      201
    );
  } catch (error) {
    console.error("Error registering user", error);
    return sendErrorResponse("Error registering user", 500);
  }
}
