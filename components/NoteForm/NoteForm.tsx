"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import type { Draft } from "@/lib/store/noteStore";

const validTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const storeDraft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [form, setForm] = useState<Draft>(storeDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    setForm(storeDraft);
  }, [storeDraft]);

  const validate = (values: Draft) => {
    const errs: Record<string, string> = {};
    if (!values.title || values.title.trim().length === 0) {
      errs.title = "Title is required";
    }
    if (values.title && values.title.length > 120) {
      errs.title = "Title must be less than 120 characters";
    }
    if (values.content && values.content.length > 3000) {
      errs.content = "Content is too long";
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    const updated = { ...form, [id]: value } as Draft;
    setForm(updated);
    setDraft({ [id]: value } as Partial<Draft>);
    setErrors(validate(updated));
  };

  // --- TanStack Mutation ---
  const createNoteMutation = useMutation({
    mutationFn: async (note: Draft) => {
      const res = await fetch("/api/notes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return res.json();
    },
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    createNoteMutation.mutate(form);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          maxLength={120}
          disabled={createNoteMutation.isPending}
        />
        {errors.title && (
          <span id="title-error" className={css.error}>
            {errors.title}
          </span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={form.content}
          onChange={handleChange}
          aria-describedby={errors.content ? "content-error" : undefined}
          disabled={createNoteMutation.isPending}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={form.tag}
          onChange={handleChange}
          disabled={createNoteMutation.isPending}
        >
          {validTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onCancel}
          disabled={createNoteMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={
            createNoteMutation.isPending || Object.keys(errors).length > 0
          }
        >
          {createNoteMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {errors.submit && <p className={css.error}>{errors.submit}</p>}
    </form>
  );
}
