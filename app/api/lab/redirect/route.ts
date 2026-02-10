import { getLabConfig } from "@/lib/labConfig";

function isSafeRedirect(target: string) {
  return target.startsWith("/") && !target.startsWith("//");
}

export async function GET(req: Request) {
  const config = await getLabConfig();
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to") || "/";
  if (config.openRedirect) {
    return Response.redirect(to, 302);
  }
  const safeTarget = isSafeRedirect(to) ? to : "/";
  return Response.redirect(safeTarget, 302);
}
