// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    // Solo lanzamos error cuando REALMENTE se usa (runtime), no al importar
    throw new Error("Falta MONGODB_URI en variables de entorno");
  }
  if (!dbName) {
    throw new Error("Falta MONGODB_DB en variables de entorno");
  }

  if (!client) {
    client = new MongoClient(uri, {
      // opciones seguras para Node runtime
      maxPoolSize: 10,
    });
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}
