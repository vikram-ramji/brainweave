import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { nanoid } from "nanoid";
import { Value } from "platejs";

export const user = t.pgTable(
  "user",
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

export const session = t.pgTable(
  "session",
  {
    id: t.text("id").primaryKey(),
    expiresAt: t.timestamp("expires_at").notNull(),
    token: t.text("token").notNull().unique(),
    ...timestamps,
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    t.index("session_user_id_idx").on(table.userId),
    t.index("session_token_idx").on(table.token),
  ],
);

export const account = t.pgTable(
  "account",
  {
    id: t.text("id").primaryKey(),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    idToken: t.text("id_token"),
    accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
    scope: t.text("scope"),
    password: t.text("password"),
    ...timestamps,
  },
  (table) => [t.index("account_user_id_idx").on(table.userId)],
);

export const verification = t.pgTable(
  "verification",
  {
    id: t.text("id").primaryKey(),
    identifier: t.text("identifier").notNull(),
    value: t.text("value").notNull(),
    expiresAt: t.timestamp("expires_at").notNull(),
    ...timestamps,
  },
  (table) => [t.index("verification_identifier_idx").on(table.identifier)],
);

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
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.index("notes_user_id_id_idx").on(table.userId, table.id)],
);
