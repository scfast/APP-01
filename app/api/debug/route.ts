import { getDb } from "@/lib/mongo";
import { json, errorJson } from "@/lib/api";

export async function GET() {
  try {
    const db = await getDb();
    const files = await db.collection("files").find({}).limit(5).toArray();
    const users = await db.collection("users").find({}).limit(5).toArray();

    return json({
      env: {
        MONGODB_URI: process.env.MONGODB_URI,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
        TRAINING_MODE: process.env.TRAINING_MODE
      },
      sample: { files, users }
    });
  } catch (err) {
    console.error("Debug endpoint error", err);
    return errorJson(err);
  }
}
