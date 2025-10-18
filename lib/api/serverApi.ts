import { nextApi } from "@/lib/api/api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SessionData {
  user: User | null;
}

async function getCookieHeader(): Promise<string | undefined> {
  const cookiesStore = await cookies();

  const cookieStrings = cookiesStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`);

  return cookieStrings.length > 0 ? cookieStrings.join("; ") : undefined;
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

  const config = {
    headers: {
      Cookie: await getCookieHeader(),
    },
    params,
  };

  const response = await nextApi.get<FetchNotesResponse>("/notes", config);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const config = {
    headers: {
      Cookie: await getCookieHeader(),
    },
  };

  const response = await nextApi.get<Note>(`/notes/${id}`, config);
  return response.data;
}

export async function getMe(): Promise<User> {
  const config = {
    headers: {
      Cookie: await getCookieHeader(),
    },
  };

  const response = await nextApi.get<User>("/users/me", config);
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse<SessionData>> {
  const config = {
    headers: {
      Cookie: await getCookieHeader(),
    },
  };

  try {
    const response = await nextApi.get<SessionData>("/auth/session", config);

    return response;
  } catch {
    return {
      data: { user: null },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {},
      request: {},
    } as AxiosResponse<SessionData>;
  }
}
