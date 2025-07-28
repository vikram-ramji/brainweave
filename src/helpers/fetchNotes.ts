import axios from "axios";
import { NotesWithPagination } from "@/types/NotesApi";

interface FetchNotesArgs {
  pageParam: string | null;
}

export default async function fetchNotes({
  pageParam,
}: FetchNotesArgs): Promise<NotesWithPagination> {
  const query = pageParam ? `?cursor=${pageParam}` : "";

  const { data: response } = await axios.get(`/api/notes${query}`);

  if (!response.success) {
    throw new Error(response.message);
  }

  console.log("Fetched notes:", response.data);

  return response.data;
}
