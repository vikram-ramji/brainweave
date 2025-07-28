import axios from "axios";
import { NotesWithPagination } from "@/types/NotesApi";
import { toast } from "sonner";

interface FetchNotesArgs {
  pageParam: string | null;
  queryKey: string[];
}

export default async function fetchNotes({
  pageParam,
  queryKey,
}: FetchNotesArgs): Promise<NotesWithPagination> {
  const [, searchQuery] = queryKey;
  const params = new URLSearchParams();

  if (pageParam) {
    params.append("cursor", pageParam);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  const queryString = params.toString();

  const { data: response } = await axios.get(
    `/api/notes${queryString ? `?${queryString}` : ""}`
  );
  if (!response.success) {
    toast.error(`Error fetching notes: ${response.error || "Unknown error"}`);
  }

  return response.data;
}
