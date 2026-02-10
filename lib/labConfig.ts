import { getDb } from "@/lib/mongo";

export type LabConfig = {
  reflectedXss: boolean;
  openRedirect: boolean;
  insecureCookies: boolean;
  verboseErrors: boolean;
  missingSecurityHeaders: boolean;
  verboseServerHeader: boolean;
  idorUserLookup: boolean;
  nosqlInjection: boolean;
  noCsrf: boolean;
};

const defaultConfig: LabConfig = {
  reflectedXss: true,
  openRedirect: true,
  insecureCookies: true,
  verboseErrors: true,
  missingSecurityHeaders: true,
  verboseServerHeader: true,
  idorUserLookup: true,
  nosqlInjection: true,
  noCsrf: true
};

const allowedKeys = new Set<keyof LabConfig>([
  "reflectedXss",
  "openRedirect",
  "insecureCookies",
  "verboseErrors",
  "missingSecurityHeaders",
  "verboseServerHeader",
  "idorUserLookup",
  "nosqlInjection",
  "noCsrf"
]);

export function getDefaultLabConfig() {
  return { ...defaultConfig };
}

function sanitizeConfig(doc: any): LabConfig {
  const merged: LabConfig = { ...defaultConfig, ...(doc || {}) };
  return merged;
}

export async function getLabConfig(): Promise<LabConfig> {
  const db = await getDb();
  const collection = db.collection("lab_config");
  const doc = await collection.findOne({ _id: "default" });
  if (!doc) {
    await collection.insertOne({
      _id: "default",
      ...defaultConfig,
      updatedAt: new Date()
    });
    return { ...defaultConfig };
  }
  return sanitizeConfig(doc);
}

export async function updateLabConfig(
  patch: Partial<LabConfig>
): Promise<LabConfig> {
  const updates: Partial<LabConfig> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (allowedKeys.has(key as keyof LabConfig)) {
      updates[key as keyof LabConfig] = Boolean(value) as any;
    }
  }
  const db = await getDb();
  const collection = db.collection("lab_config");
  await collection.updateOne(
    { _id: "default" },
    { $set: { ...updates, updatedAt: new Date() } },
    { upsert: true }
  );
  return getLabConfig();
}

export async function resetLabConfig(): Promise<LabConfig> {
  const db = await getDb();
  const collection = db.collection("lab_config");
  await collection.updateOne(
    { _id: "default" },
    { $set: { ...defaultConfig, updatedAt: new Date() } },
    { upsert: true }
  );
  return { ...defaultConfig };
}
