import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { and, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import {
  GetNotesSchema,
  NoteIdSchema,
  NoteToTagSchema,
  SearchNotesSchema,
  UpdateNoteSchema,
} from "../schema";
import { notesToTagsTable, tags } from "@/db/schema/tags";

export const notesRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(NoteIdSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const existingNote = await db.query.notes.findFirst({
        where: and(eq(notes.id, input.id), eq(notes.userId, userId)),
        with: {
          notesToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      const { notesToTags, ...noteData } = existingNote;

      const tagList = notesToTags.map((nt) => nt.tag);

      return { ...noteData, tags: tagList };
    }),

  getMany: protectedProcedure
    .input(GetNotesSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const limit = input.limit ?? 12;
      const { cursor, tagName } = input;

      const subquery = tagName
        ? db
            .select({ noteId: notesToTagsTable.noteId })
            .from(notesToTagsTable)
            .innerJoin(tags, eq(notesToTagsTable.tagId, tags.id))
            .where(and(eq(tags.name, tagName), eq(tags.userId, userId)))
        : undefined;

      const userNotes = await db.query.notes.findMany({
        limit: limit + 1,
        where: and(
          eq(notes.userId, userId),
          cursor
            ? or(
                lt(notes.createdAt, cursor.createdAt),
                and(
                  eq(notes.createdAt, cursor.createdAt),
                  lt(notes.id, cursor.id),
                ),
              )
            : undefined,
          subquery ? inArray(notes.id, subquery) : undefined,
        ),
        with: {
          notesToTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: [desc(notes.createdAt), desc(notes.id)],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (userNotes.length > limit) {
        const nextItem = userNotes.pop();
        if (nextItem) {
          nextCursor = {
            createdAt: nextItem.createdAt,
            id: nextItem.id,
          };
        }
      }

      const notesWithTags = userNotes.map((note) => {
        const { notesToTags, ...noteData } = note;
        const tagList = notesToTags.map((nt) => nt.tag);
        return { ...noteData, tags: tagList };
      });

      return { notes: notesWithTags, nextCursor };
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

    return {
      ...insertedNote,
      tags: [],
    };
  }),

  update: protectedProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const updatedNoteCTE = db.$with("updated_note").as(
        db
          .update(notes)
          .set({
            title: input.title,
            content: input.content,
            textContent: input.textContent,
          })
          .where(and(eq(notes.id, input.id), eq(notes.userId, userId)))
          .returning(),
      );

      const results = await db
        .with(updatedNoteCTE)
        .select()
        .from(updatedNoteCTE)
        .leftJoin(
          notesToTagsTable,
          eq(updatedNoteCTE.id, notesToTagsTable.noteId),
        )
        .leftJoin(tags, eq(notesToTagsTable.tagId, tags.id));

      if (results.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found or you do not have permission to update it.",
        });
      }

      const finalResult = {
        ...results[0].updated_note,
        tags: results
          .filter((row) => row.notes_to_tags && row.tags)
          .map((row) => ({
            ...row.tags!,
          })),
      };

      return finalResult;
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
          message: "Note not found or you do not have permission to delete it.",
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

      const ftsVectorExpression = sql`(setweight(to_tsvector('english', ${notes.title}), 'A') || setweight(to_tsvector('english', ${notes.textContent}), 'B') || setweight(to_tsvector('simple', ${notes.tagsText}), 'C'))`;

      const tsQuery = sql`(websearch_to_tsquery('english', ${query}) || websearch_to_tsquery('simple', ${query}))`;
      const rank = sql<number>`ts_rank(${ftsVectorExpression}, ${tsQuery})`.as(
        "rank",
      );
      const snippet =
        sql<string>`ts_headline('english', ${notes.textContent}, ${tsQuery}, 'StartSel=<strong>, StopSel=</strong>, MaxWords=30, MinWords=10')`.as(
          "snippet",
        );

      const searchResults = await db
        .select({
          id: notes.id,
          rank: rank,
          snippet: snippet,
        })
        .from(notes)
        .where(
          and(
            eq(notes.userId, userId),
            sql`${ftsVectorExpression} @@ ${tsQuery}`,
            parsedCursor
              ? sql`(${rank}, ${notes.id}) < (${parsedCursor.rank}, ${parsedCursor.id})`
              : undefined,
          ),
        )
        .orderBy(desc(rank), desc(notes.id))
        .limit(limit + 1);

      if (searchResults.length === 0) {
        return {
          searchNotes: [],
          nextCursor: undefined,
        };
      }

      let nextCursor: string | undefined = undefined;
      if (searchResults.length > limit) {
        const last = searchResults.pop();
        if (last) {
          nextCursor = Buffer.from(
            JSON.stringify({ rank: last.rank, id: last.id }),
          ).toString("base64");
        }
      }

      const noteIds = searchResults.map((note) => note.id);

      const enrichedNotes = await db.query.notes.findMany({
        where: inArray(notes.id, noteIds),
        with: {
          notesToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      const searchResultMap = new Map(
        searchResults.map((item) => [
          item.id,
          { rank: item.rank, snippet: item.snippet },
        ]),
      );

      const finalNotes = enrichedNotes
        .map((note) => {
          const { notesToTags, ...noteData } = note;
          const tagList = notesToTags.map((nt) => nt.tag);
          const searchData = searchResultMap.get(note.id)!;
          return {
            ...noteData,
            tags: tagList,
            rank: searchData.rank,
            snippet: searchData.snippet,
          };
        })
        .sort((a, b) => {
          const rankA = searchResultMap.get(a.id)!.rank;
          const rankB = searchResultMap.get(b.id)!.rank;
          if (rankB !== rankA) {
            return rankB - rankA;
          }
          return b.id.localeCompare(a.id);
        });

      return {
        searchNotes: finalNotes,
        nextCursor,
      };
    }),

  addTag: protectedProcedure
    .input(NoteToTagSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      await db.transaction(async (tx) => {
        const note = await tx.query.notes.findFirst({
          where: and(eq(notes.id, input.noteId), eq(notes.userId, userId)),
        });
        if (!note) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to modify this note.",
          });
        }
        const userTag = await tx.query.tags.findFirst({
          where: and(eq(tags.id, input.tagId), eq(tags.userId, userId)),
        });
        if (!userTag) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to use this tag.",
          });
        }
        await tx
          .insert(notesToTagsTable)
          .values({ noteId: input.noteId, tagId: input.tagId })
          .onConflictDoNothing();
      });

      const updatedNote = await db.query.notes.findFirst({
        where: eq(notes.id, input.noteId),
        with: {
          notesToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      if (!updatedNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found or you do not have permission to update it.",
        });
      }

      const { notesToTags, ...noteData } = updatedNote;

      const tagList = notesToTags.map((nt) => nt.tag);

      return {
        ...noteData,
        tags: tagList,
      };
    }),

  removeTag: protectedProcedure
    .input(NoteToTagSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const note = await db.query.notes.findFirst({
        where: and(eq(notes.id, input.noteId), eq(notes.userId, userId)),
      });
      if (!note) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to modify this note.",
        });
      }

      await db
        .delete(notesToTagsTable)
        .where(
          and(
            eq(notesToTagsTable.noteId, input.noteId),
            eq(notesToTagsTable.tagId, input.tagId),
          ),
        );

      const updatedNote = await db.query.notes.findFirst({
        where: eq(notes.id, input.noteId),
        with: {
          notesToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      if (!updatedNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found or you do not have permission to update it.",
        });
      }

      const { notesToTags, ...noteData } = updatedNote;

      const tags = notesToTags.map((nt) => nt.tag);

      return {
        ...noteData,
        tags,
      };
    }),
});
