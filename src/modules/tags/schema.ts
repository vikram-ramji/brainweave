import { z } from "zod";

export const InsertTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[\w\s-]+$/, {
      message: "Only letters, numbers, spaces, and dashes are allowed",
    }),
});

export const TagIdSchema = z.union([
  z.object({ id: z.string().min(1).max(50) }),
  z.object({ name: z.string().trim().min(1).max(50) }),
]);

export const UpdateTagSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().trim().min(1).max(50),
});
