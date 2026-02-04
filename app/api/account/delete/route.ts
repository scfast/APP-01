import { admin } from "@/lib/firebaseAdmin";
import { getDb } from "@/lib/mongo";
import { json, errorJson } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    if (!email) return json({ error: "email required" }, { status: 400 });

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);

    const db = await getDb();
    await db.collection("users").deleteOne({ uid: user.uid });

    return json({ ok: true, email });
  } catch (err) {
    console.error("Account delete error", err);
    return errorJson(err);
  }
}
