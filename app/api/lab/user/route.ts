import { getDb } from "@/lib/mongo";
import { json } from "@/lib/api";
import { getLabConfig } from "@/lib/labConfig";
import { getAuth } from "@/lib/auth";
import { labErrorJson } from "@/lib/labErrors";

export async function GET(req: Request) {
  try {
    const config = await getLabConfig();
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "";
    if (!uid) {
      return labErrorJson(new Error("uid is required"), config, 400);
    }

    if (!config.idorUserLookup) {
      const auth = await getAuth(req);
      if (!auth) return labErrorJson(new Error("Unauthorized"), config, 401);
      if (auth.uid !== uid) return labErrorJson(new Error("Forbidden"), config, 403);
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ uid });
    return json({ user });
  } catch (err) {
    const config = await getLabConfig();
    return labErrorJson(err, config);
  }
}
