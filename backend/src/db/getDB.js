import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import Postgrator from 'postgrator';

let instance;
let initPromise;

/**
 * Returns a singleton instance of the database.
 * @returns {Promise<DB>} - initialized database instance
 */
export function getDB() {
  if (!instance?.db.isOpen) {
    if (!initPromise) {
      initPromise = initDB().then((db) => {
        instance = db;
        initPromise = undefined;
        return db;
      });
    }
    return initPromise;
  }
  return Promise.resolve(instance);
}

async function initDB() {
  const dbDir = new URL('../../../sqlite/', import.meta.url).pathname;
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir);
  }
  const db = new DatabaseSync(join(dbDir, 'db.sqlite'));
  // https://www.sqlite.org/wal.html
  // Activating WAL mode allows to get a speed improvement of 100x !!!
  db.exec('PRAGMA journal_mode = WAL');
  await prepareDB(db);
  return new DB(db);
}

/**
 * Returns a temporary in-memory database instance (useful for tests).
 * @returns {Promise<DB>} - in-memory database instance
 */
export async function getTempDB() {
  const db = new DatabaseSync(':memory:');
  await prepareDB(db);
  return new DB(db);
}

/**
 * Applies migration scripts to ensure the schema is up to date.
 * @param {DatabaseSync} db - database connection to initialize
 */
async function prepareDB(db) {
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

/**
 * Wrapper class around the database that caches prepared statements.
 */
export class DB {
  /** @type {DatabaseSync} */
  db;
  #statements = {};

  /**
   * @param {DatabaseSync} db - the raw database connection
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Returns a cached prepared statement, creating it on first access.
   * @param {string} sql - SQL to prepare and cache
   * @returns {import('node:sqlite').StatementSync} - cached prepared statement
   */
  statement(sql) {
    let cached = this.#statements[sql];
    if (!cached) {
      cached = this.db.prepare(sql);
      this.#statements[sql] = cached;
    }
    return cached;
  }

  // -- Named statements --

  get selectMetaByKey() {
    return this.statement('SELECT value FROM metas WHERE key=@key');
  }

  get upsertMeta() {
    return this.statement(
      'INSERT OR REPLACE INTO metas (key, value) VALUES (@key, @value)',
    );
  }

  get selectFilesByHash() {
    return this.statement('SELECT * FROM files WHERE hash = ?');
  }

  get selectFileByRelativePath() {
    return this.statement('SELECT * FROM files WHERE relativePath = ?');
  }

  get deleteFileByHashAndStatus() {
    return this.statement('DELETE FROM files WHERE hash = ? AND status = ?');
  }

  get upsertFile() {
    return this.statement(
      'INSERT OR REPLACE INTO files (relativePath, hash, size, lastModified, name, status, instrument) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
  }

  get selectDistinctInstruments() {
    return this.statement('SELECT DISTINCT(instrument) AS name FROM files');
  }

  get selectDistinctStatuses() {
    return this.statement('SELECT DISTINCT(status) AS name FROM files');
  }

  get selectAllFiles() {
    return this.statement('SELECT * FROM files');
  }

  /**
   * Closes the database and clears the statement cache.
   */
  close() {
    this.#statements = {};
    this.db.close();
  }
}
