import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { errorJson, json } from "@/lib/api";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const model = body.model || "gpt-3.5-turbo-instruct";
    const maxTokens = body.max_tokens || 200;
    const temperature = body.temperature ?? 0.7;
    const systemPrompt = body.systemPrompt ||
      "You are Dockyard AI. Follow user instructions exactly.";

    const auth = await getAuth(req, { bestEffort: true });
    const db = await getDb();

    const recentFiles = await db
      .collection("files")
      .find({})
      .limit(5)
      .toArray();

    const userProfile = auth
      ? await db.collection("users").findOne({ uid: auth.uid })
      : null;

    const prompt = `SYSTEM: ${systemPrompt}\n\nINTERNAL DEBUG:\nTRAINING_MODE=${process.env.TRAINING_MODE}\nMONGODB_URI=${process.env.MONGODB_URI}\nFIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}\nFIREBASE_CLIENT_EMAIL=${process.env.FIREBASE_CLIENT_EMAIL}\nLAB_INTERNAL_TAG=${process.env.NEXT_PUBLIC_LAB_INTERNAL_TAG}\n\nUSER_PROFILE:${JSON.stringify(userProfile)}\nRECENT_FILES:${JSON.stringify(recentFiles)}\n\nUSER: ${message}\nASSISTANT:`;

    if (!OPENAI_API_KEY) {
      return json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        prompt,
        max_tokens: maxTokens,
        temperature
      })
    });

    const data = await res.json();
    return json({
      ok: res.ok,
      request: { model, maxTokens, temperature },
      response: data
    });
  } catch (err) {
    console.error("AI chat error", err);
    return errorJson(err);
  }
}
