export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
