import DetailsPageClient from "./NoteDetails.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const note = await fetchNoteById(id);

    const title = note?.title ?? "Note Details | NoteHub";
    const description =
      note?.content?.slice(0, 160) ??
      "View the details of this note on NoteHub.";

    return {
      title: `${title} | NoteHub`,
      description,
      openGraph: {
        title: `${title} | NoteHub`,
        description,
        url: `https://notehub-nextjs.vercel.app/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    return {
      title: "Note Not Found | NoteHub",
      description: "The note you are looking for does not exist.",
      openGraph: {
        title: "Note Not Found | NoteHub",
        description: "The note you are looking for does not exist.",
        url: `https://notehub-nextjs.vercel.app/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

interface PageProps {
  params: { id: string };
}

const Details = async ({ params }: PageProps) => {
  const resolvedParams = params;
  const id = resolvedParams.id;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailsPageClient id={id} />
    </HydrationBoundary>
  );
};

export default Details;
