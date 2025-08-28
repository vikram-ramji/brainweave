import * as auth from "./auth";
import { notes } from "./notes";
import { users } from "./users";

export const schema = {
  users,
  ...auth,
  notes,
};
