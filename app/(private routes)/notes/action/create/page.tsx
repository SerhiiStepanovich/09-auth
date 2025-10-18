import CreateNoteClient from "@/components/CreateNoteClient/CreateNoteClient";
import css from "@/components/CreateNoteClient/CreateNoteClient.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note | NoteHub",
  description: "Create a new note quickly and easily on NoteHub.",
  openGraph: {
    title: "Create Note | NoteHub",
    description: "Create a new note quickly and easily on NoteHub.",
    url: "https://notehub-nextjs.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <CreateNoteClient />
      </div>
    </main>
  );
}
