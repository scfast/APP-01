import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dockyard_docs";

if (!uri) {
  throw new Error("MONGODB_URI is required");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient() {
  if (client) return client;
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  client = await clientPromise;
  return client;
}

export async function getDb() {
  const mongo = await getMongoClient();
  return mongo.db(dbName);
}
