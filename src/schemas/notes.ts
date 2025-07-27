import * as z from "zod";

// Schema for creating a new note
export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Note title is required" })
    .max(255, { message: "Note title cannot exceed 255 characters" }),
  content: z.any().optional(),
  textContent: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

// Schema for updating an existing note
// All fields are optional for update, as user might only update one field
export const UpdateNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Note title cannot be empty" })
    .max(255, { message: "Note title cannot exceed 255 characters" })
    .optional(),
  content: z.any().optional(),
  textContent: z.string().optional(),
});

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
