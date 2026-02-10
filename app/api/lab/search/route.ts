import { getDb } from "@/lib/mongo";
import { json } from "@/lib/api";
import { getLabConfig } from "@/lib/labConfig";
import { labErrorJson } from "@/lib/labErrors";

export async function GET(req: Request) {
  try {
    const config = await getLabConfig();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const filterParam = searchParams.get("filter") || "";

    const db = await getDb();
    const collection = db.collection("files");

    if (config.nosqlInjection && filterParam) {
      const unsafeFilter = JSON.parse(filterParam);
      const files = await collection.find(unsafeFilter).limit(50).toArray();
      return json({ files, mode: "unsafe" });
    }

    const files = await collection
      .find({ filename: { $regex: q, $options: "i" } })
      .limit(50)
      .toArray();

    return json({ files, mode: "safe" });
  } catch (err) {
    const config = await getLabConfig();
    return labErrorJson(err, config);
  }
}
