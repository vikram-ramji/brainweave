import getServerSession from "@/app/lib/getServerSession";
import { ErrorResponse, SuccessResponseWithData } from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";
import { TagSchema } from "@/schemas/tags";
import { NextRequest } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const data = await request.json();
    const parsed = TagSchema.safeParse(data);
    if (!parsed.success) {
      return ErrorResponse("Invalid tag data");
    }

    const { name } = parsed.data;

    const tag = await prisma.tag.update({
      where: { id: params.id, userId: session.user.id },
      data: { name },
    });

    return SuccessResponseWithData(tag);
  } catch (error) {
    console.error("Failed to update tag:", error);
    return ErrorResponse("Failed to update tag, try again!", 500);
  }
}

export const DELETE = async (
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const tag = await prisma.tag.delete({
      where: { id: params.id, userId: session.user.id },
    });

    return SuccessResponseWithData(tag);
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return ErrorResponse("Failed to delete tag, try again!", 500);
  }
};