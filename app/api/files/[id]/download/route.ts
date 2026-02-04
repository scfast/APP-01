import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req, { bestEffort: true });
    if (!auth) return json({ error: "Not authenticated" }, { status: 401 });
    const db = await getDb();
    const file = await db
      .collection("files")
      .findOne({ _id: new ObjectId(params.id) });
    if (!file) return json({ error: "Not found" }, { status: 404 });

    if (file.publicUrl) {
      return Response.redirect(file.publicUrl, 302);
    }

    return json({ error: "No public URL" }, { status: 404 });
  } catch (err) {
    console.error("Download error", err);
    return errorJson(err);
  }
}
