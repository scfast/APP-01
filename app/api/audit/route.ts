import { getDb } from "@/lib/mongo";
import { json, errorJson } from "@/lib/api";

export async function GET() {
  try {
    const db = await getDb();
    const audit = await db.collection("audit").find({}).limit(200).toArray();
    return json({ audit });
  } catch (err) {
    console.error("Audit list error", err);
    return errorJson(err);
  }
}
