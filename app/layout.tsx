import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub — Your Personal Notes Organizer",
  description:
    "NoteHub helps you create, organize, and manage your personal notes efficiently.",
  openGraph: {
    title: "NoteHub — Your Personal Notes Organizer",
    description:
      "NoteHub helps you create, organize, and manage your personal notes efficiently.",
    url: "https://notehub-nextjs.vercel.app/",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            {modal}
          </AuthProvider>
        </TanStackProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
