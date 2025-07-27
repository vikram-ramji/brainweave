import { Note, Tag } from "@/generated/prisma";

export interface NoteWithTags extends Note {
  tags: Tag[];
};