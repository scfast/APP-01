import { getLabConfig } from "@/lib/labConfig";
import { buildLabHeaders, escapeHtml } from "@/lib/labHeaders";

export async function GET(req: Request) {
  const config = await getLabConfig();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const body = config.reflectedXss ? q : escapeHtml(q);
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Reflect Lab</title>
  </head>
  <body>
    <h1>Reflection Lab</h1>
    <p>Echo:</p>
    <div>${body}</div>
  </body>
</html>`;
  const headers = buildLabHeaders(config, {
    "Content-Type": "text/html; charset=utf-8"
  });
  return new Response(html, { headers });
}
