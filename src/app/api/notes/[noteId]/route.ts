import getServerSession from "@/app/lib/getServerSession";
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseWithData,
} from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";
import { UpdateNoteSchema } from "@/schemas/notes";
import { NoteWithTags } from "@/types/NoteWithTags";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { noteId } = await params;

    const note = await prisma.note.findUnique({
      where: { id: noteId, userId: session.user.id },
      include: {
        tags: true,
      },
    });

    if (!note) {
      return ErrorResponse("Note not found", 404);
    }

    return SuccessResponseWithData<NoteWithTags>(note);
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return ErrorResponse("Failed to fetch note, try again!", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { noteId } = await params;
    const data = await request.json();
    const parsed = UpdateNoteSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid Title or content");
    }

    const { title, content, tagIds, textContent } = parsed.data;

    const note = await prisma.note.update({
      where: { id: noteId, userId: session.user.id },
      data: {
        title,
        content,
        textContent,
        tags: {
          set: tagIds?.map((tagId) => ({ id: tagId })),
        },
      },
      include: {
        tags: true,
      },
    });

    return SuccessResponseWithData<NoteWithTags>(note);
  } catch (error) {
    console.error("Failed to update note:", error);
    return ErrorResponse("Failed to update note, try again!", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { noteId } = await params;

    await prisma.note.delete({
      where: { id: noteId, userId: session.user.id },
    });

    return SuccessResponse("Note deleted successfully", 200);
  } catch (error) {
    console.error("Failed to delete note:", error);
    return ErrorResponse("Failed to delete note, try again!", 500);
  }
}
