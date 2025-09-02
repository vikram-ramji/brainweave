import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { InsertTagSchema, TagIdSchema, UpdateTagSchema } from "../schema";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const tagsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(InsertTagSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const name = input.name.trim();

      const [insertedTag] = await db
        .insert(tags)
        .values({
          name,
          userId,
        })
        .returning();

      if (!insertedTag) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tag",
        });
      }

      return insertedTag;
    }),

  getOne: protectedProcedure
    .input(TagIdSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [existingTag] = await db
        .select()
        .from(tags)
        .where(
          and(
            eq(tags.userId, userId),
            "id" in input
              ? eq(tags.id, input.id)
              : eq(tags.name, input.name.trim()),
          ),
        );

      if (!existingTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      return existingTag;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const userTags = await db
      .select()
      .from(tags)
      .where(eq(tags.userId, userId))
      .orderBy(tags.name);

    return userTags;
  }),

  update: protectedProcedure
    .input(UpdateTagSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const name = input.name.trim();
      const id = input.id;

      const [updatedTag] = await db
        .update(tags)
        .set({ name })
        .where(and(eq(tags.id, id), eq(tags.userId, userId)))
        .returning();

      if (!updatedTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found or you do not have permission to update it.",
        });
      }
      return updatedTag;
    }),

  delete: protectedProcedure
    .input(TagIdSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [deletedTag] = await db
        .delete(tags)
        .where(
          and(
            "id" in input
              ? eq(tags.id, input.id)
              : eq(tags.name, input.name.trim()),
            eq(tags.userId, userId),
          ),
        )
        .returning();

      if (!deletedTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found or you do not have permission to delete it.",
        });
      }
      return { success: true };
    }),
});
