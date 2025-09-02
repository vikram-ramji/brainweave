import * as t from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../columns.helpers";
import { users } from "./users";
import { notes } from "./notes";

export const tags = t.pgTable(
  "tags",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: t.text("name").notNull(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.index("tag_user_idx").on(table.userId),
    t.uniqueIndex("tag_user_unique_idx").on(table.userId, table.name),
  ],
);

export const notesToTagsTable = t.pgTable(
  "notes_to_tags",
  {
    noteId: t
      .text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: t
      .text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [t.primaryKey({ columns: [table.noteId, table.tagId] })],
);
