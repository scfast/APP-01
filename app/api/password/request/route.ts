import { admin } from "@/lib/firebaseAdmin";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

function makeToken() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 100)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    if (!email) return json({ error: "email required" }, { status: 400 });

    let user = null;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (err) {
      return json({ error: "No account found for that email." }, { status: 404 });
    }

    const token = makeToken();
    const db = await getDb();
    await db.collection("password_resets").insertOne({
      email,
      token,
      userExists: !!user,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date()
    });

    return json({
      ok: true,
      token,
      userExists: !!user,
      resetUrl: `/reset/${token}`
    });
  } catch (err) {
    console.error("Password reset request error", err);
    return errorJson(err);
  }
}
