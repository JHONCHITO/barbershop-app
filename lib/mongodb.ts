// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

export const runtime = "nodejs";

// Fuerza tipo `string` con inicializador que arroja si falta
const MONGODB_URI: string =
  process.env.MONGODB_URI ?? (() => { throw new Error("Falta MONGODB_URI en variables de entorno"); })();

// Nombre de DB con default y tipo `string`
const MONGODB_DB: string = process.env.MONGODB_DB ?? "barbershop";

// ---- Cache global para Next (evita múltiples conexiones y “Topology is closed”)
type MongoCache = {
  client: MongoClient | null;
  db: Db | null;
  uri: string | null;
  dbName: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongo: MongoCache | undefined;
}

const globalForMongo = global as unknown as { _mongo?: MongoCache };

if (!globalForMongo._mongo) {
  globalForMongo._mongo = { client: null, db: null, uri: null, dbName: null };
}

const cache = globalForMongo._mongo;

async function getClient(): Promise<MongoClient> {
  // Reutiliza si coincide la misma URI/DB
  if (cache.client && cache.uri === MONGODB_URI && cache.dbName === MONGODB_DB) {
    return cache.client;
  }

  // Cierra cliente previo si cambia la config
  if (cache.client) {
    try { await cache.client.close(); } catch { /* ignore */ }
  }

  const client = new MongoClient(MONGODB_URI); // <- `string`
  await client.connect();

  cache.client = client;
  cache.uri = MONGODB_URI;      // <- `string` asignable a `string | null`
  cache.dbName = MONGODB_DB;    // <- `string` asignable a `string | null`

  return client;
}

export async function getDB(): Promise<Db> {
  if (cache.db && cache.dbName === MONGODB_DB) {
    return cache.db;
  }
  const client = await getClient();
  const db = client.db(MONGODB_DB); // <- `string`
  cache.db = db;
  return db;
}
