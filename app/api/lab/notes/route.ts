import { getDb } from "@/lib/mongo";
import { json } from "@/lib/api";
import { getLabConfig } from "@/lib/labConfig";
import { getAuth } from "@/lib/auth";
import { labErrorJson } from "@/lib/labErrors";

export async function POST(req: Request) {
  try {
    const config = await getLabConfig();
    const contentType = req.headers.get("content-type") || "";
    let content = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      content = body?.content || "";
    } else {
      const formData = await req.formData();
      content = String(formData.get("content") || "");
    }

    if (!config.noCsrf) {
      const auth = await getAuth(req);
      if (!auth) return labErrorJson(new Error("Unauthorized"), config, 401);
    }

    const db = await getDb();
    const result = await db.collection("lab_notes").insertOne({
      content,
      createdAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || "unknown"
    });

    return json({ ok: true, id: result.insertedId });
  } catch (err) {
    const config = await getLabConfig();
    return labErrorJson(err, config);
  }
}
