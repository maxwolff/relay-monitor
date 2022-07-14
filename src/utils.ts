import Database from "better-sqlite3";
import BetterSqlite3 from "better-sqlite3";
import path from "path";
import { submitBlindedBlockRequest } from "./routes";

export const getDB = (): BetterSqlite3.Database => {
  let dbPath;
  switch (process.env.NODE_ENV) {
    case "test":
      dbPath = ":memory:";
      break;
    case "production":
      dbPath = path.join(__dirname, "../", "prod.db");
      break;
    default:
      dbPath = path.join(__dirname, "../", "dev.db");
  }
  return new Database(dbPath, { fileMustExist: false });
};

export const MAX_RESP_TIME = process.env.MAX_RESP_TIME || 2000;

export const getDummyBlockRequest = (
  slot: string,
  relay_url: string
): submitBlindedBlockRequest => {
  return {
    signed_blinded_block: {
      message: { slot },
    },
    relay_url,
  };
};

export const getDummyRequests = (
  start: number,
  count: number,
  relay_url: string
): submitBlindedBlockRequest[] => {
  return Array.from({ length: count }, (v, i) => i).map((num) =>
    getDummyBlockRequest((start + num).toString(), relay_url)
  );
};
