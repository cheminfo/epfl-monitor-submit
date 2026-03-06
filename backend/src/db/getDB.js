import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import Postgrator from 'postgrator';

let db;

/**
 * Returns a promise that resolves as an instance of the database
 * @returns {Promise<DatabaseSync>} - promise that resolves as an instance of the database
 */
export async function getDB() {
  if (!db?.isOpen) {
    const path = new URL('../../../sqlite/', import.meta.url).pathname;
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = new DatabaseSync(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.exec('PRAGMA journal_mode = WAL');
    await prepareDB(db);
  }
  return db;
}

/**
 * Returns a Promise that resolves to a temporary instance of the database
 * @returns {Promise<DatabaseSync>} - promise that resolves as an instance of the temporary database
 */
export async function getTempDB() {
  const tempDB = new DatabaseSync(':memory:');
  await prepareDB(tempDB);
  return tempDB;
}

/**
 * Internal function that ensures that the schema of the database is up to date
 * @param {DatabaseSync} db - the instance of sqlite3 database
 */
export async function prepareDB(db) {
  const postgrator = new Postgrator({
    migrationPattern: join(import.meta.dirname, 'migrations/*'),
    driver: 'sqlite3',
    execQuery: (query) => {
      const stmt = db.prepare(query);
      const rows = stmt.all();
      return { rows };
    },
    execSqlScript: (sqlScript) => {
      db.exec(sqlScript);
    },
  });
  await postgrator.migrate();
}
