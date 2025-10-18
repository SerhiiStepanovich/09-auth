"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

import NotePreview from "./[id]/NotePreview.client";

export default function NoteModalClient({ id }: { id: string }) {
  const router = useRouter();

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <NotePreview id={id} />
    </Modal>
  );
}
