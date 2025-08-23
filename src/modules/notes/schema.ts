import { z } from "zod";
import type { Value } from "platejs";

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
