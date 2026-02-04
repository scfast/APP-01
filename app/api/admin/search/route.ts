import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await getAuth(req, { bestEffort: true });
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const db = await getDb();
    const files = await db
      .collection("files")
      .find({
        $or: [
          { filename: { $regex: q, $options: "i" } },
          { ownerEmail: { $regex: q, $options: "i" } }
        ]
      })
      .limit(100)
      .toArray();

    return json({ files });
  } catch (err) {
    console.error("Admin search error", err);
    return errorJson(err);
  }
}
