"use client";

import React from "react";
import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useNoteStore } from "@/lib/store/noteStore";

export default function CreateNoteClient() {
  const router = useRouter();
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    clearDraft();
    router.back();
  };

  return <NoteForm onCancel={handleCancel} onSuccess={handleSuccess} />;
}
