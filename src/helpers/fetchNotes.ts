import { ApiResponse } from "@/types/ApiResponse";
import { NotesApiData } from "@/types/NotesApi";
import axios from "axios";

// The function that fetches a "page" (batch) of notes
const fetchNotes = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<NotesApiData> => {
  const params = new URLSearchParams();
  params.append("limit", "10");
  if (pageParam) params.append("cursor", pageParam);

  const response: ApiResponse<NotesApiData> = await axios.get(`/api/notes?${params.toString()}`);
  if (!response.success) throw new Error(response.message || "Failed to fetch notes");
  return response.data as NotesApiData;
};

export default fetchNotes;
