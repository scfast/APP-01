import { getDb } from "@/lib/mongo";
import { json, errorJson } from "@/lib/api";

export async function GET(req: Request, { params }: { params: { uid: string } }) {
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ uid: params.uid });
    if (!user) return json({ error: "Not found" }, { status: 404 });
    return json({ user });
  } catch (err) {
    console.error("User lookup error", err);
    return errorJson(err);
  }
}
