import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await getAuth(req, { bestEffort: true });
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid) return json({ error: "uid required" }, { status: 400 });

    const db = await getDb();
    const files = await db.collection("files").find({ ownerUid: uid }).toArray();

    return json({ files });
  } catch (err) {
    console.error("List by owner error", err);
    return errorJson(err);
  }
}
