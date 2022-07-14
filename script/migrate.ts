import BetterSqlite3 from "better-sqlite3";
import { readdir, readFile } from "fs";
import { promisify } from "util";
import path from "path";

const rfAsync = promisify(readFile);

import { getDB } from "../src/utils";

export const migrate = async (
  upOrDown: "up" | "down",
  number: string,
  db_?: BetterSqlite3.Database
) => {
  const db = db_ ? db_ : getDB();
  var filepath = path.join(
    __dirname,
    "../",
    "migrations",
    `${number}-${upOrDown}.sql`
  );
  const file = await rfAsync(filepath, "utf-8");
  const info = db.exec(file.toString());
  return db;
};

if (require.main === module) {
  migrate("up", "001");
}
