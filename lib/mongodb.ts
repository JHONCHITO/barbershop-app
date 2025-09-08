// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

/** Lee y valida la URI, devolviendo siempre un string */
function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.length === 0) {
    // Mensaje claro para build/local
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  return uri;
}

/** Obtiene una instancia singleton de Db (reutilizable en server actions/rutas) */
export async function getDb(): Promise<Db> {
  if (db) return db;

  const uri = getMongoUri(); // ← ahora es string garantizado
  if (!client) {
    client = new MongoClient(uri);
  }

  await client.connect();
  db = client.db(); // usa el DB por defecto definido en la URI (o el 'admin' del cluster)
  return db!;
}

/** Útil en tests o cierres controlados */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
