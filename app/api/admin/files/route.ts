import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await getAuth(req, { bestEffort: true });
    const db = await getDb();
    const files = await db.collection("files").find({}).sort({ createdAt: -1 }).toArray();
    return json({ files });
  } catch (err) {
    console.error("Admin list error", err);
    return errorJson(err);
  }
}
