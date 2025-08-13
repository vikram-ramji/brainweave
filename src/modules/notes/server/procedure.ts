import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CreateNoteSchema } from "../schema";
import { db } from "@/db";
import { notes } from "@/db/schema";

export const notesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdNote] = await db
        .insert(notes)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdNote;
    }),
});
