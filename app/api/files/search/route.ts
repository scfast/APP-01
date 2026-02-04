import { getDb } from "@/lib/mongo";
import { json, errorJson } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const db = await getDb();
    const files = await db
      .collection("files")
      .find({ filename: { $regex: q, $options: "i" } })
      .limit(200)
      .toArray();

    return json({ files });
  } catch (err) {
    console.error("File search error", err);
    return errorJson(err);
  }
}
