import { notesRouter } from "@/modules/notes/server/procedure";

import { createTRPCRouter } from "../init";
import { tagsRouter } from "@/modules/tags/server/procedure";

export const appRouter = createTRPCRouter({
  notes: notesRouter,
  tags: tagsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
