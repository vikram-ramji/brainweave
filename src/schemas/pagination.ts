import z from "zod";

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .pipe(z.int().min(1, { error: "Limit must be a positive integer" })),
  search: z.string().optional(),
});
