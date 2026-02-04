import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";
import { ObjectId } from "mongodb";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await getAuth(req, { bestEffort: true });
    const body = await req.json();
    const status = body.status || "pending";

    const db = await getDb();
    await db.collection("files").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return json({ ok: true, status });
  } catch (err) {
    console.error("Admin status error", err);
    return errorJson(err);
  }
}
