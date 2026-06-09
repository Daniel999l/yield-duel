import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "yield-duel";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export function isMongoConfigured(): boolean {
  return !!uri;
}

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise =
      global._mongoClientPromise ??
      client.connect().then((connected) => {
        global._mongoClientPromise = Promise.resolve(connected);
        return connected;
      });
    global._mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  return client.db(dbName);
}