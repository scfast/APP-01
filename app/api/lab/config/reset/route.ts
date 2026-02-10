import { json, errorJson } from "@/lib/api";
import { resetLabConfig } from "@/lib/labConfig";

export async function POST() {
  try {
    const config = await resetLabConfig();
    return json({ config });
  } catch (err) {
    return errorJson(err);
  }
}
