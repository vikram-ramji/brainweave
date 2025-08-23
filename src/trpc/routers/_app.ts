import { notesRouter } from "@/modules/notes/server/procedure";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  notes: notesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
