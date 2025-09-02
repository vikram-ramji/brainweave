import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Tags = RouterOutput["tags"]["getAll"];

export type Tag = RouterOutput["tags"]["getOne"];
