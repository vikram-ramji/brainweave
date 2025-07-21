import { ErrorResponse, SuccessResponse } from "@/helpers/ApiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiErrorResponse } from "@/types/ApiResponse";
import { ApiError } from "next/dist/server/api-utils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

async function validateRequest(params: { noteId: string; tagId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {error: ErrorResponse("Not Authenticated", 401)};
  }

  const note = await prisma.note.findUnique({
    where: { id: params.noteId, userId: session.user.id },
  });

  if (!note) {
    return {error: ErrorResponse("Note not found", 404)};
  }

  const tag = await prisma.tag.findUnique({
    where: { id: params.tagId, userId: session.user.id },
  });

  if (!tag) {
    return {error: ErrorResponse("Tag not found", 404)};
  }

  return { noteId: note.id, tagId: tag.id };
}


export async function POST({
  params,
}: {
  params: { noteId: string; tagId: string };
}) {
  try {
    const validation = await validateRequest(params);
    if (validation.error) {
      return validation.error;
    }

    const { noteId, tagId } = validation;

    await prisma.note.update({
      where: { id: noteId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    });

    return SuccessResponse("Tag added to note successfully", 200);
  } catch (error) {
    console.error("Failed to add tag to note:", error);
    return ErrorResponse("Failed to add tag to note, try again!", 500);
  }
}

export async function DELETE({
  params,
}: {
  params: { noteId: string; tagId: string };
}) {
  try {
    const validation = await validateRequest(params);
    if (validation.error) {
      return validation.error;
    }

    const { noteId, tagId } = validation;

    await prisma.note.update({
      where: { id: noteId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    });

    return SuccessResponse("Tag removed from note successfully", 200);
  } catch (error) {
    console.error("Failed to remove tag from note:", error);
    return ErrorResponse("Failed to remove tag from note, try again!", 500);
  }
}