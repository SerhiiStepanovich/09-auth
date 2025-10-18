import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL;
const TOKEN = process.env.NOTEHUB_TOKEN;

interface NoteData {
  title: string;
  content?: string;
  tag: string;
}

const validTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

async function parseRequest(request: Request): Promise<NoteData> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  } else if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    return {
      title: (form.get("title") as string) || "",
      content: (form.get("content") as string) || "",
      tag: (form.get("tag") as string) || "Todo",
    };
  } else {
    try {
      return await request.json();
    } catch {
      return { title: "", content: "", tag: "Todo" };
    }
  }
}

export async function POST(request: Request) {
  try {
    const data: NoteData = await parseRequest(request);

    if (!data.title || data.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!validTags.includes(data.tag)) {
      data.tag = "Todo";
    }

    if (API_BASE) {
      const response = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          { error: json.message || "Failed to create note" },
          { status: response.status }
        );
      }
      return NextResponse.json(json);
    }

    const created = {
      id: String(Date.now()),
      title: data.title,
      content: data.content,
      tag: data.tag,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/notes/create:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
