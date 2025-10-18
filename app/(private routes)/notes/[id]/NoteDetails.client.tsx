"use client";

import { fetchNoteById } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";

interface DetailsPageClientProps {
  id: string;
}

const DetailsPageClient = ({ id }: DetailsPageClientProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (!id) return <p>Note ID is missing</p>;
  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h1>Note details</h1>
      {data ? (
        <>
          <h2>{data.title}</h2>
          <p>{data.content}</p>
          <p>Category: {data.categoryId}</p>
        </>
      ) : (
        <p>Note not found</p>
      )}
    </div>
  );
};

export default DetailsPageClient;
