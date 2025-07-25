import { ErrorResponse, SuccessResponse } from "@/helpers/ApiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function GET () {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return ErrorResponse("Not Authenticated", 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return ErrorResponse("User not found", 404);
        }

        return SuccessResponse("User fetched successfully", 200, user);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return ErrorResponse("Failed to fetch user data, try again!", 500);
    }
}