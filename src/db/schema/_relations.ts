import { relations } from "drizzle-orm";
import { users } from "./users";
import { notes } from "./notes";
import { notesToTagsTable, tags } from "./tags";

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  tags: many(tags),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  notesToTags: many(notesToTagsTable),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  notesToTags: many(notesToTagsTable),
}));

export const notesToTagsRelations = relations(notesToTagsTable, ({ one }) => ({
  note: one(notes, {
    fields: [notesToTagsTable.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [notesToTagsTable.tagId],
    references: [tags.id],
  }),
}));
