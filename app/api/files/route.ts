import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req);
    if (!auth) return json({ error: "Not authenticated" }, { status: 401 });

    const db = await getDb();
    const files = await db
      .collection("files")
      .find({ ownerUid: auth.uid })
      .sort({ createdAt: -1 })
      .toArray();

    return json({ files });
  } catch (err) {
    console.error("List files error", err);
    return errorJson(err);
  }
}
