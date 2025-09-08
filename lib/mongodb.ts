// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "barberpro";

  if (!uri) {
    // NO lances al importar. Lanza aquí (runtime).
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  if (!client) {
    client = new MongoClient(uri, {
      // opciones seguras por defecto
      maxPoolSize: 10,
    });
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}
