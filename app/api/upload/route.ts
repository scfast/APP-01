import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { uploadToStorage } from "@/lib/storage";
import { errorJson, json } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req, { bestEffort: true });
    if (!auth) {
      return json({ error: "Not authenticated" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return json({ error: "Missing file" }, { status: 400 });
    }

    const requestedPath = form.get("storagePath") as string | null;
    const description = form.get("description") as string | null;
    const buffer = Buffer.from(await file.arrayBuffer());
    const storagePath =
      requestedPath || `uploads/${auth.uid}/${Date.now()}-${file.name}`;
    const upload = await uploadToStorage(storagePath, buffer, file.type);

    const db = await getDb();
    await db.collection("users").updateOne(
      { uid: auth.uid },
      {
        $setOnInsert: {
          uid: auth.uid,
          email: auth.email,
          role: "user",
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    const doc = {
      ownerUid: auth.uid,
      ownerEmail: auth.email,
      filename: file.name,
      description,
      storagePath: upload.storagePath,
      publicUrl: upload.publicUrl,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("files").insertOne(doc);

    return json({
      file: { _id: result.insertedId, ...doc },
      labInternalTag: process.env.NEXT_PUBLIC_LAB_INTERNAL_TAG
    });
  } catch (err) {
    console.error("Upload error", err);
    return errorJson(err);
  }
}
