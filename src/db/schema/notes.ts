import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { nanoid } from "nanoid";
import { Value } from "platejs";
import { users } from "./users";
import { SQL, sql } from "drizzle-orm";

export const tsvector = t.customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const notes = t.pgTable(
  "notes",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: t.varchar("title", { length: 100 }).notNull().default("Untitled"),
    content: t.jsonb("content").$type<Value>(),
    textContent: t.text("text_content").notNull().default(""),
    tagsText: t.text("tags_text").notNull().default(""),
    searchVector: tsvector("search_vector")
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`
          setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(text_content, '')), 'B') ||
          setweight(to_tsvector('simple', coalesce(tags_text, '')), 'C')
        `,
      ),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.index("notes_user_id_id_idx").on(table.userId, table.id),
    t.index("search_vector_idx").using("gin", table.searchVector),
  ],
);
