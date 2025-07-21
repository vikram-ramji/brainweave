import { Note } from "@/generated/prisma";
import { ErrorResponse, SuccessResponse } from "@/helpers/ApiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateNoteSchema } from "@/schemas/notes";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const user = session.user;
    if (!user) {
      return ErrorResponse("User not found", 404);
    }

    const data = await request.json();
    const parsed = CreateNoteSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid Title or content", 400);
    }

    const { title, content } = parsed.data;

    const note = await prisma.note.create({
      data: {
        title,
        content: content || "",
        userId: user.id,
      },
    });

    return SuccessResponse("Note created successfully", 201);
  } catch (error) {
    console.error("Failed to create note, try again!");
    return ErrorResponse("Failed to create note, try again!", 500);
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return SuccessResponse<Note[]>("Notes fetched successfully", 200, notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return ErrorResponse("Failed to fetch notes, try again!", 500);
  }
}
