"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import styles from "@/components/NotePreview/NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  if (!data) return <p>Note not found</p>;

  return (
    <Modal onClose={handleClose}>
      <div className={styles.preview}>
        <button onClick={handleClose} className={styles.closeButton}>
          ✕ Закрити
        </button>
      </div>
    </Modal>
  );
}
