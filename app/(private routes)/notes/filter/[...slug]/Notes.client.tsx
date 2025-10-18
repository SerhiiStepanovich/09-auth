"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import styles from "./Notes.module.css";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import type { FetchNotesResponse } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";

const PER_PAGE = 12;

function isNoteTag(value: string): value is NoteTag {
  return ["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(value);
}

interface NotesClientProps {
  tag: string;
}

const NotesClient: React.FC<NotesClientProps> = ({ tag }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const validTag = tag === "All" ? undefined : isNoteTag(tag) ? tag : undefined;

  const { data, isLoading, isError, error, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: [
        "notes",
        { page, perPage: PER_PAGE, search: debouncedSearch, tag: validTag },
      ],
      queryFn: () => fetchNotes(page, PER_PAGE, debouncedSearch, validTag),
      placeholderData: (prev) => prev,
    });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [tag, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create">
          <button className={styles.button}>Create a note</button>
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error: {(error as Error)?.message || "Unknown error"}</p>}
      {isFetching && !isLoading && <p>Refreshing...</p>}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes found</p>}
    </div>
  );
};

export default NotesClient;
