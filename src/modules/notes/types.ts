import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Notes = RouterOutput["notes"]["getMany"];
export type Note = Notes[number];

export type NoteGetOne = RouterOutput["notes"]["getOne"];
