import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;

function getApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Support base64-encoded key (FIREBASE_PRIVATE_KEY_BASE64) to avoid
  // newline mangling when baked through next.config.ts env block
  let privateKey: string;
  if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
  } else {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY ?? "";
    privateKey = rawKey.replace(/\\n/g, "\n");
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment."
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return app;
}

export function db(): Firestore {
  return getFirestore(getApp(), "(default)");
}
