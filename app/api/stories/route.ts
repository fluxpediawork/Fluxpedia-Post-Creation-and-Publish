import { NextResponse } from "next/server";

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.slice(i, i + 8192));
  return btoa(binary);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "untitled-story";
}

export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY || "fluxpediawork/Post-Creation-and-Publish";
  if (!token) return NextResponse.json({ error: "GitHub sync is not configured" }, { status: 503 });
  const record = await request.json();
  if (!record?.story || typeof record.story !== "string") return NextResponse.json({ error: "Story name is required" }, { status: 400 });
  const date = new Date().toISOString().slice(0, 10);
  const path = `data/stories/${date}-${slugify(record.story)}.json`;
  const apiUrl = `https://api.github.com/repos/${repository}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "tezscroll-newsroom" };
  const existing = await fetch(apiUrl, { headers, cache: "no-store" });
  const sha = existing.ok ? (await existing.json()).sha : undefined;
  const content = JSON.stringify({ schemaVersion: 1, ...record }, null, 2) + "\n";
  const saved = await fetch(apiUrl, { method: "PUT", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ message: `Record story: ${record.story}`, content: encodeBase64(content), branch: "main", ...(sha ? { sha } : {}) }) });
  if (!saved.ok) return NextResponse.json({ error: "GitHub rejected the story record" }, { status: 502 });
  return NextResponse.json({ ok: true, path });
}
