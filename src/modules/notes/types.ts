import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Notes = RouterOutput["notes"]["getMany"];
export type Note = Notes["notes"][number];

export type NoteGetOne = RouterOutput["notes"]["getOne"];
export type NoteSearch = RouterOutput["notes"]["search"]["searchNotes"][number];
