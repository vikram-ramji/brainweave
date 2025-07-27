import getServerSession from "@/app/lib/getServerSession";
import { Tag } from "@/generated/prisma";
import { ErrorResponse, SuccessResponseWithData } from "@/helpers/ApiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TagSchema } from "@/schemas/tags";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return ErrorResponse("Not Authenticated", 401);
        }

        const data = await request.json();
        const parsed = TagSchema.safeParse(data);
        if (!parsed.success) {
            return ErrorResponse("Invalid tag name", 400);
        }

        const { name } = parsed.data;
        const tag = await prisma.tag.create({
            data: {
                name,
                userId: session.user.id
            }
        });

        return SuccessResponseWithData<Tag>(tag);
    } catch (error) {
        console.error("Error while creating tag:", error);
        return ErrorResponse("Failed to create tag", 500);
    }
}

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return ErrorResponse("Not Authenticated", 401);
        }

        const tags = await prisma.tag.findMany({
            where: { userId: session.user.id }
        });

        return SuccessResponseWithData<Tag[]>(tags);
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return ErrorResponse("Failed to fetch tags, try again!", 500);
    }
}