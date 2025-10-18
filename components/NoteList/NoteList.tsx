import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import styles from "./NoteList.module.css";
import { deleteNote } from "../../lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "notes",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete the note?")) {
      mutation.mutate(id);
    }
  };

  if (!notes.length) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>

            <Link
              href={`/notes/${note.id}`}
              as={`/notes/${note.id}`}
              className={styles.link}
            >
              Preview
            </Link>

            <button
              className={styles.button}
              onClick={() => handleDelete(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
