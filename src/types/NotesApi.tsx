import { NoteWithTags } from "./NoteWithTags";

export interface NotesWithPagination {
  notes: NoteWithTags[];
  pagination: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};