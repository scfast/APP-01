import { admin } from "@/lib/firebaseAdmin";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const uidOverride = body.uid;
    if (!email && !uidOverride) {
      return json({ error: "email or uid required" }, { status: 400 });
    }

    let uid = uidOverride;
    let resolvedEmail = email;

    if (!uid && email) {
      const user = await admin.auth().getUserByEmail(email);
      uid = user.uid;
      resolvedEmail = user.email || email;
    }

    if (!uid) {
      return json({ error: "Could not resolve uid" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("users").updateOne(
      { uid },
      {
        $set: {
          uid,
          email: resolvedEmail,
          role: "admin",
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return json({ ok: true, uid, email: resolvedEmail });
  } catch (err) {
    console.error("Seed admin error", err);
    return errorJson(err);
  }
}
