import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req, { bestEffort: true });
    if (!auth) return json({ role: "user" });

    const db = await getDb();
    const user = await db.collection("users").findOne({ uid: auth.uid });
    return json({ role: user?.role || "user" });
  } catch (err) {
    console.error("Admin role error", err);
    return errorJson(err);
  }
}
