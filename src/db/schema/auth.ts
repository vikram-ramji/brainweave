import * as t from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { users } from "./users";

export const sessions = t.pgTable(
  "sessions",
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
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    t.index("session_user_id_idx").on(table.userId),
    t.index("session_token_idx").on(table.token),
  ],
);

export const accounts = t.pgTable(
  "accounts",
  {
    id: t.text("id").primaryKey(),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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

export const verifications = t.pgTable(
  "verifications",
  {
    id: t.text("id").primaryKey(),
    identifier: t.text("identifier").notNull(),
    value: t.text("value").notNull(),
    expiresAt: t.timestamp("expires_at").notNull(),
    ...timestamps,
  },
  (table) => [t.index("verification_identifier_idx").on(table.identifier)],
);
