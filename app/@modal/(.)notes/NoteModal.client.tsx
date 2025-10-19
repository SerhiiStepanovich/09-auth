"use client";

import NotePreview from "./[id]/NotePreview.client";

export default function NoteModalClient({ id }: { id: string }) {
  return <NotePreview id={id} />;
}
