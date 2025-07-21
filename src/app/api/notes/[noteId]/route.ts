import { Note } from "@/generated/prisma";
import { ErrorResponse, SuccessResponse } from "@/helpers/ApiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UpdateNoteSchema } from "@/schemas/notes";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET({ params }: { params: { noteId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const note = await prisma.note.findUnique({
      where: { id: params.noteId, userId: session.user.id },
    });

    if (!note) {
      return ErrorResponse("Note not found", 404);
    }

    return SuccessResponse<Note>("Note fetched successfully", 200, note);
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return ErrorResponse("Failed to fetch note, try again!", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const data = await request.json();
    const parsed = UpdateNoteSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid Title or content", 400);
    }

    const { title, content } = parsed.data;

    const note = await prisma.note.update({
      where: { id: params.noteId, userId: session.user.id },
      data: { title, content },
    });

    return SuccessResponse("Note updated successfully", 200);
  } catch (error) {
    console.error("Failed to update note:", error);
    return ErrorResponse("Failed to update note, try again!", 500);
  }
}

export async function DELETE({ params }: { params: { noteId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const note = await prisma.note.delete({
      where: { id: params.noteId, userId: session.user.id },
    });

    return SuccessResponse("Note deleted successfully", 200);
  } catch (error) {
    console.error("Failed to delete note:", error);
    return ErrorResponse("Failed to delete note, try again!", 500);
  }
}
