import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NoteIdSchema, UpdateNoteSchema } from "../schema";

export const notesRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(NoteIdSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const [existingNote] = await db
        .select()
        .from(notes)
        .where(and(eq(notes.id, input.id), eq(notes.userId, userId)));

      if (!existingNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      return existingNote;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId));

    return userNotes;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const [insertedNote] = await db
      .insert(notes)
      .values({
        userId: ctx.auth.user.id,
      })
      .returning();

    if (!insertedNote) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create note",
      });
    }

    return insertedNote;
  }),

  update: protectedProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const [updatedNote] = await db
        .update(notes)
        .set({
          title: input.title,
          content: input.content,
          textContent: input.textContent,
        })
        .where(and(eq(notes.id, input.id), eq(notes.userId, userId)))
        .returning();

      if (!updatedNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      return updatedNote;
    }),

  delete: protectedProcedure
    .input(NoteIdSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const [deletedNote] = await db
        .delete(notes)
        .where(and(eq(notes.id, input.id), eq(notes.userId, userId)))
        .returning();

      if (!deletedNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      return { success: true };
    }),
});
