import getServerSession from "@/app/lib/getServerSession";
import { ErrorResponse, SuccessResponseWithData } from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";
import { TagSchema } from "@/schemas/tags";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    // Check if it's a valid UUID (ID) or treat as name
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        decodedId
      );

    const whereClause = isUUID
      ? { id: decodedId, userId: session.user.id }
      : { name: decodedId, userId: session.user.id };

    const tag = await prisma.tag.findFirst({
      where: whereClause,
      include: {
        notes: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            tags: true,
          },
        },
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    if (!tag) {
      return ErrorResponse("Tag not found", 404);
    }

    return SuccessResponseWithData(tag);
  } catch (error) {
    console.error("Failed to fetch tag:", error);
    return ErrorResponse("Failed to fetch tag", 500);
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { id } = await params;
    const data = await request.json();
    const parsed = TagSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid tag data");
    }

    const { name } = parsed.data;

    const tag = await prisma.tag.update({
      where: { id, userId: session.user.id },
      data: { name },
    });

    return SuccessResponseWithData(tag);
  } catch (error) {
    console.error("Failed to update tag:", error);
    return ErrorResponse("Failed to update tag, try again!", 500);
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const { id } = await params;

    const tag = await prisma.tag.delete({
      where: { id, userId: session.user.id },
    });

    return SuccessResponseWithData(tag);
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return ErrorResponse("Failed to delete tag, try again!", 500);
  }
};
