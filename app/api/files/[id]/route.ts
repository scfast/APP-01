import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await getAuth(req, { bestEffort: true });
    const db = await getDb();
    const file = await db
      .collection("files")
      .findOne({ _id: new ObjectId(params.id) });
    if (!file) return json({ error: "Not found" }, { status: 404 });

    return json({ file });
  } catch (err) {
    console.error("Get file error", err);
    return errorJson(err);
  }
}
