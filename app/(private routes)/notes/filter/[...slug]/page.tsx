import type { Metadata } from "next";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] ?? "All";

  const validTags: NoteTag[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];

  const displayTag = validTags.includes(tag as NoteTag) ? tag : "All";
  const capitalizedTag =
    displayTag.charAt(0).toUpperCase() + displayTag.slice(1);

  return {
    title: `${capitalizedTag} - Notes | NoteHub`,
    description: `View notes filtered by tag: ${capitalizedTag} on NoteHub.`,
    openGraph: {
      title: `${capitalizedTag} - Notes | NoteHub`,
      description: `View notes filtered by tag: ${capitalizedTag} on NoteHub.`,
      url: `https://notehub-nextjs.vercel.app/notes/filter/${displayTag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slugArray = resolvedParams.slug ?? [];
  const tag = slugArray[0] ?? "All";

  const query =
    typeof resolvedSearchParams?.query === "string"
      ? resolvedSearchParams.query
      : "";

  const page =
    typeof resolvedSearchParams?.page === "string"
      ? parseInt(resolvedSearchParams.page, 10)
      : 1;

  const queryClient = new QueryClient();

  const validTags: NoteTag[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];

  const tagParam: NoteTag | undefined = validTags.includes(tag as NoteTag)
    ? (tag as NoteTag)
    : undefined;

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, perPage: 12, search: query, tag: tagParam }],
    queryFn: () => fetchNotes(page, 12, query, tagParam),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
