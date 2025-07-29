import { Tag } from "@/generated/prisma";
import { NoteWithTags } from "./NoteWithTags";

export interface TagWithNotes extends Tag {
    notes: NoteWithTags[];
    _count: {
        notes: number;
    }
}
