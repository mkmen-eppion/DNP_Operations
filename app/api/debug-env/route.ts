import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
    NEWSLETTERS_API_KEY: !!process.env.NEWSLETTERS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
}
