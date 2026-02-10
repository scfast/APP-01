import { json, errorJson } from "@/lib/api";
import { getLabConfig, updateLabConfig } from "@/lib/labConfig";

export async function GET() {
  try {
    const config = await getLabConfig();
    return json({ config });
  } catch (err) {
    return errorJson(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.updates && typeof body.updates === "object") {
      const config = await updateLabConfig(body.updates);
      return json({ config });
    }
    if (typeof body?.key === "string") {
      const config = await updateLabConfig({ [body.key]: body.value });
      return json({ config });
    }
    return errorJson(new Error("Invalid payload"), 400);
  } catch (err) {
    return errorJson(err);
  }
}
