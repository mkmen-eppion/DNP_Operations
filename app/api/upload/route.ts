import { NextRequest, NextResponse } from "next/server";
import { getApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { db } from "@/lib/firestore"; // ensures firebase-admin is initialised

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_BYTES = 300 * 1024; // 300 KB

// Signed URLs expire after 10 years (max allowed is 7 days for service accounts
// without domain-wide delegation, but for ad images we want them permanent).
// We use 7 days and re-sign on access — simpler: just make the file publicly
// readable via a signed URL valid for the maximum 7-day window, then store it.
// For a permanent solution, configure uniform bucket-level access + allUsers in
// Firebase Console → Storage → Rules, then we can use a direct storage URL.
// Until then we use a 7-day signed URL and note it will need refreshing.
//
// RECOMMENDED: In Firebase Console go to Storage → Rules and set:
//   allow read: if true;
// Then the simple https://storage.googleapis.com/<bucket>/<path> URL works forever.

const SIGNED_URL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function requireApiKey(req: NextRequest): boolean {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  return !apiKey || req.headers.get("x-api-key") === apiKey;
}

export async function POST(req: NextRequest) {
  if (!requireApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucket) {
    return NextResponse.json(
      { error: "FIREBASE_STORAGE_BUCKET is not configured." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, GIF and WebP images are accepted." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File exceeds 200 KB limit (${Math.round(file.size / 1024)} KB received).` },
      { status: 400 }
    );
  }

  try {
    // db() ensures firebase-admin is initialised before getStorage
    void db();

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `ads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const storage = getStorage(getApp());
    const fileRef = storage.bucket(bucket).file(filename);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    // Permanent public URL — requires Storage rules: allow read: if true for /ads/**
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json(
      { error: "Upload failed. Check server logs." },
      { status: 500 }
    );
  }
}
