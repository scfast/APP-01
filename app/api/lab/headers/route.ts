import { getLabConfig } from "@/lib/labConfig";
import { buildLabHeaders } from "@/lib/labHeaders";

export async function GET() {
  const config = await getLabConfig();
  const headers = buildLabHeaders(config, {
    "Content-Type": "text/html; charset=utf-8"
  });
  const html = `<!doctype html>
<html>
  <head><title>Header Lab</title></head>
  <body>
    <h1>Security Header Lab</h1>
    <p>Use ZAP to compare headers with toggles on/off.</p>
  </body>
</html>`;
  return new Response(html, { headers });
}
