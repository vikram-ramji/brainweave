import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { and, desc, eq, getTableColumns, lt, sql } from "drizzle-orm";
import {
  GetNotesSchema,
  NoteIdSchema,
  SearchNotesSchema,
  UpdateNoteSchema,
} from "../schema";

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

  getMany: protectedProcedure
    .input(GetNotesSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const limit = input.limit ?? 12;
      const { cursor } = input;
      const userNotes = await db.query.notes.findMany({
        limit: limit + 1,
        where: and(
          eq(notes.userId, userId),
          cursor ? lt(notes.id, cursor) : undefined,
        ),
        orderBy: [desc(notes.id)],
      });

      const nextCursor =
        userNotes.length > limit ? userNotes.pop()?.id : undefined;

      return { notes: userNotes, nextCursor };
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

  search: protectedProcedure
    .input(SearchNotesSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const query = input.query.trim();
      const limit = input.limit ?? 12;
      const cursor = input.cursor;

      const parsedCursor = cursor
        ? (JSON.parse(Buffer.from(cursor, "base64").toString("utf8")) as {
            rank: number;
            id: string;
          })
        : undefined;

      const terms = query.split(" ").filter(Boolean);
      const lastTerm = terms.pop();

      const sanitizedLastTerm = lastTerm?.replace(/['|&!*:]/g, "");
      const processedQueryString = [...terms, `${sanitizedLastTerm}:*`].join(
        " & ",
      );
      const tsQuery = sql`to_tsquery('english', ${processedQueryString})`;
      const rank = sql<number>`ts_rank(${notes.search}, ${tsQuery})`.as("rank");
      const snippet =
        sql<string>`ts_headline('english', ${notes.textContent}, ${tsQuery}, 'StartSel=<strong>, StopSel=</strong>, MaxWords=30, MinWords=10')`.as(
          "snippet",
        );

      const searchNotes = await db
        .select({
          ...getTableColumns(notes),
          rank: rank,
          snippet: snippet,
        })
        .from(notes)
        .where(
          and(
            eq(notes.userId, userId),
            sql`${notes.search} @@ ${tsQuery}`,
            parsedCursor
              ? sql`(${rank}, ${notes.id}) < (${parsedCursor.rank}, ${parsedCursor.id})`
              : undefined,
          ),
        )
        .orderBy(desc(rank), desc(notes.id))
        .limit(limit + 1);

      const last = searchNotes.length > limit ? searchNotes.pop() : undefined;
      const nextCursor = last
        ? Buffer.from(
            JSON.stringify({ rank: last.rank, id: last.id }),
          ).toString("base64")
        : undefined;

      return {
        searchNotes,
        nextCursor,
      };
    }),
});
