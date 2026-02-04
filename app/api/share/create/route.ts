import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";
import { ObjectId } from "mongodb";

function makeToken() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req, { bestEffort: true });
    if (!auth) return json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const fileId = body.fileId;
    if (!fileId) return json({ error: "fileId required" }, { status: 400 });

    const db = await getDb();
    const token = makeToken();
    const shareDoc = {
      fileId: new ObjectId(fileId),
      createdByUid: auth.uid,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      accessCount: 0,
      createdAt: new Date()
    };

    await db.collection("shares").insertOne(shareDoc);

    return json({ share: { token, expiresAt: shareDoc.expiresAt } });
  } catch (err) {
    console.error("Share create error", err);
    return errorJson(err);
  }
}
