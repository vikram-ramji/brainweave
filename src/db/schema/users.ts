import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const users = t.pgTable(
  "users",
  {
    id: t.text("id").primaryKey(),
    name: t.text("name").notNull(),
    email: t.text("email").notNull().unique(),
    emailVerified: t
      .boolean("email_verified")
      .$defaultFn(() => false)
      .notNull(),
    image: t.text("image"),
    ...timestamps,
  },
  (table) => [t.index("user_email_idx").on(table.email)],
);
