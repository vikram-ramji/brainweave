import getServerSession from "@/app/lib/getServerSession";
import { ErrorResponse, SuccessResponseWithData } from "@/helpers/ApiResponse";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return ErrorResponse("Not Authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        notes: true,
        tags: true, // Include related data and counts if needed
      },
    });

    if (!user) {
      return ErrorResponse("User not found", 404);
    }

    return SuccessResponseWithData(user, "User fetched successfully");
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return ErrorResponse("Failed to fetch user data, try again!", 500);
  }
}
