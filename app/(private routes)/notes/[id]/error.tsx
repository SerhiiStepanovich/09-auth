"use client";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function NoteErrorPage({ error }: ErrorPageProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}
