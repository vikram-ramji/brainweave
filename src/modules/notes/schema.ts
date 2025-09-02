import { z } from "zod";
import type { Value } from "platejs";

export const GetNotesSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  cursor: z
    .object({
      createdAt: z.date(),
      id: z.nanoid(),
    })
    .optional(),
  tagName: z.string().optional(),
});

export const NoteIdSchema = z.object({ id: z.string() });

export const UpdateNoteSchema = z.object({
  id: z.nanoid({ error: "Invalid note ID" }),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  content: z.custom<Value>().optional(),
  textContent: z.string().optional(),
});

export const SearchNotesSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be less than 100 characters")
    .refine((val) => val.trim().length >= 2, {
      message: "Search query must not be empty",
    }),
  limit: z.number().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

export const NoteToTagSchema = z.object({
  noteId: z.nanoid(),
  tagId: z.nanoid(),
});
