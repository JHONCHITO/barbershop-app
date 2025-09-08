import type { Db, MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongo:
    | {
        client: MongoClient | null;
        db: Db | null;
        uri: string | null;
        dbName: string | null;
      }
    | undefined;
}

export {};
