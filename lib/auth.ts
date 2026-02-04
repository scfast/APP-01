import { admin } from "@/lib/firebaseAdmin";

export type AuthResult = {
  uid: string;
  email?: string | null;
  decoded?: any;
  verified: boolean;
};

function getTokenFromHeaders(headers: Headers) {
  const auth = headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const cookie = headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

function unsafeDecode(token: string) {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function getAuth(
  req: Request,
  opts: { bestEffort?: boolean } = {}
): Promise<AuthResult | null> {
  const token = getTokenFromHeaders(req.headers);
  const url = new URL(req.url);
  const uidParam = url.searchParams.get("uid");
  const tokenParam = url.searchParams.get("token");
  if (!token && opts.bestEffort && uidParam) {
    return { uid: uidParam, email: null, verified: false };
  }
  if (!token && opts.bestEffort && tokenParam) {
    const decoded = unsafeDecode(tokenParam);
    if (decoded?.user_id || decoded?.uid) {
      return {
        uid: decoded.user_id || decoded.uid,
        email: decoded.email,
        decoded,
        verified: false
      };
    }
  }
  if (!token) return null;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, decoded, verified: true };
  } catch (err) {
    if (opts.bestEffort) {
      const decoded = unsafeDecode(token);
      if (decoded?.user_id || decoded?.uid) {
        return {
          uid: decoded.user_id || decoded.uid,
          email: decoded.email,
          decoded,
          verified: false
        };
      }
    }
    return null;
  }
}
