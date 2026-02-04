import { admin } from "@/lib/firebaseAdmin";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token;
    const email = body.email;
    const newPassword = body.newPassword;

    if (!newPassword) {
      return json({ error: "newPassword required" }, { status: 400 });
    }

    const db = await getDb();
    const record = token
      ? await db.collection("password_resets").findOne({ token })
      : null;

    let targetEmail = email || record?.email;
    if (!targetEmail) {
      return json({ error: "email or valid token required" }, { status: 400 });
    }

    const user = await admin.auth().getUserByEmail(targetEmail);
    await admin.auth().updateUser(user.uid, { password: newPassword });

    await db.collection("password_resets").updateOne(
      { _id: record?._id },
      { $set: { usedAt: new Date() } }
    );

    return json({ ok: true, email: targetEmail });
  } catch (err) {
    console.error("Password reset error", err);
    return errorJson(err);
  }
}
