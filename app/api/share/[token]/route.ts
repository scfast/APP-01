import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const db = await getDb();
    const share = await db.collection("shares").findOne({ token: params.token });
    if (!share) return json({ error: "Not found" }, { status: 404 });

    await db.collection("shares").updateOne(
      { _id: share._id },
      { $set: { accessCount: (share.accessCount || 0) + 1 } }
    );

    const file = await db.collection("files").findOne({ _id: share.fileId });
    if (!file) return json({ error: "File missing" }, { status: 404 });

    return json({
      file: {
        _id: file._id,
        filename: file.filename,
        ownerEmail: file.ownerEmail,
        storagePath: file.storagePath,
        publicUrl: file.publicUrl,
        description: file.description
      },
      share: {
        token: share.token,
        expiresAt: share.expiresAt,
        accessCount: share.accessCount
      }
    });
  } catch (err) {
    console.error("Share resolve error", err);
    return errorJson(err);
  }
}
