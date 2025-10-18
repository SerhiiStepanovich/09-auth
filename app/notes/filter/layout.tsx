import React from "react";
import Sidebar from "@/components/SidebarNotes/SidebarNotes";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <aside>
        <Sidebar />
      </aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
