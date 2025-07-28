import getServerSession from "@/app/lib/getServerSession";
import {
  ErrorResponse,
  SuccessResponseWithData,
} from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";
import { CreateNoteSchema } from "@/schemas/notes";
import { cursorPaginationSchema } from "@/schemas/pagination";
import { NotesWithPagination } from "@/types/NotesApi";
import { NoteWithTags } from "@/types/NoteWithTags";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const data = await request.json();
    const parsed = CreateNoteSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid title or content", 400);
    }

    const { title, content, tagIds, textContent } = parsed.data;

    const note = await prisma.note.create({
      data: {
        title,
        content: content || {},
        textContent: textContent || "",
        userId: session.user.id,
        ...(tagIds &&
          tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          }),
      },
      include: {
        tags: true,
      },
    });

    return SuccessResponseWithData<NoteWithTags>(note);
  } catch (error) {
    console.error("Failed to create note:", error);
    return ErrorResponse("Failed to create note, try again!", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const searchParams = new URL(request.url).searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const parsedQueryParams = cursorPaginationSchema.safeParse(queryParams);
    if (!parsedQueryParams.success) {
      return ErrorResponse("Invalid query parameters", 400);
    }

    const { cursor, limit, search } = parsedQueryParams.data;
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { textContent: { contains: search, mode: "insensitive" } },
            { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        tags: true,
      },
    });

    const nextCursor = notes.length > 0 ? notes[notes.length - 1].id : null;

    return SuccessResponseWithData<NotesWithPagination>({
      notes,
      pagination: {
        limit,
        nextCursor,
        hasNextPage: notes.length === limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return ErrorResponse("Failed to fetch notes, try again!", 500);
  }
}
