import { getLabConfig } from "@/lib/labConfig";
import { buildLabHeaders } from "@/lib/labHeaders";

export async function GET() {
  const config = await getLabConfig();
  const base = "sessionId=lab-session-" + Math.random().toString(36).slice(2);
  const insecure = `${base}; Path=/; Max-Age=604800`;
  const secure = `${base}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Strict`;
  const headers = buildLabHeaders(config, {
    "Content-Type": "application/json",
    "Set-Cookie": config.insecureCookies ? insecure : secure
  });
  return new Response(
    JSON.stringify({
      cookieMode: config.insecureCookies ? "insecure" : "secure"
    }),
    { headers }
  );
}
