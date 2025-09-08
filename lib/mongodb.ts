// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("Falta la variable de entorno MONGODB_URI");
}

const dbName = process.env.MONGODB_DB || "barbershop";

declare global {
  // para cachear en hot-reload / serverless
  // (usar any aquí evita conflictos de tipos en runtimes)
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __mongoDb: Db | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global.__mongoClientPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 5,
    retryWrites: true,
  });
  global.__mongoClientPromise = client.connect();
}

clientPromise = global.__mongoClientPromise;

export async function getDB(): Promise<Db> {
  if (global.__mongoDb) return global.__mongoDb;
  const client = await clientPromise;       // connect() es idempotente en v6
  const db = client.db(dbName);
  global.__mongoDb = db;
  return db;
}
