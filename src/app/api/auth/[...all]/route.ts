import { auth } from "@/modules/auth/lib/auth"; // Adjust the import path as necessary
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
