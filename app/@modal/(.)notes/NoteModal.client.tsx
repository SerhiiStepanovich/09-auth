"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreview from "./[id]/NotePreview.client";
import styles from "@/components/NotePreview/NotePreview.module.css";

export default function NoteModalClient({ id }: { id: string }) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <div className={styles.preview}>
        <button onClick={handleClose} className={styles.closeButton}>
          ✕ Закрити
        </button>
        <NotePreview id={id} />
      </div>
    </Modal>
  );
}
