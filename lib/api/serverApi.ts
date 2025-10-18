import { serverApi } from "@/lib/api/api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CheckSessionResponse {
  user: User | null;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag && tag.toLowerCase() !== "all") params.tag = tag;

  const response = await serverApi.get<FetchNotesResponse>("/notes", {
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await serverApi.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await serverApi.get<User>("/users/me");
  return response.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const response = await serverApi.get<CheckSessionResponse>("/auth/session");
    return response.data.user;
  } catch {
    return null;
  }
}
