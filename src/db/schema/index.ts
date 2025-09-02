import * as auth from "./auth";
import { notes } from "./notes";
import * as tags from "./tags";
import { users } from "./users";
import * as _relations from "./_relations";

export const schema = {
  users,
  ...auth,
  notes,
  ...tags,
  ..._relations,
};
