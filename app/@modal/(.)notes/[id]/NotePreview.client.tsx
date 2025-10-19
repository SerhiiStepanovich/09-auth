"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const { data, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  if (!data) return <p>Note not found</p>;

  return (
    <>
      <h2>{data.title}</h2>
      <p>{data.content}</p>
      <p>Created: {data.createdAt}</p>
      {data.tag && <p>Tag: {data.tag}</p>}
    </>
  );
}
