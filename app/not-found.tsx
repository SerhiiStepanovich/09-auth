import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | NoteHub",
  description: "The page you're looking for doesn't exist or has been moved.",
  openGraph: {
    title: "Page Not Found | NoteHub",
    description: "The page you're looking for doesn't exist or has been moved.",
    url: "https://notehub-nextjs.vercel.app/not-found",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
