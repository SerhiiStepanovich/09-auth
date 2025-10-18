import { nextApi } from "@/lib/api/api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await nextApi.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await nextApi.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await nextApi.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const response = await nextApi.get<User>("/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const response = await nextApi.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const response = await nextApi.patch<User>("/users/me", data);
  return response.data;
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

  const response = await nextApi.get<FetchNotesResponse>("/notes", {
    params,
  });
  return response.data;
}

export async function createNote(newNote: CreateNoteParams): Promise<Note> {
  const response = await nextApi.post<Note>("/notes", newNote);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextApi.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextApi.get<Note>(`/notes/${id}`);
  return response.data;
}
