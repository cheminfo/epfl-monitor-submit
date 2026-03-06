/**
 * save a key-value pair in the metas table
 * @param {import('node:sqlite').DatabaseSync} db - the sqlite3 database
 * @param {string} key - key to store
 * @param {unknown} value - value to store
 */
export function setMeta(db, key, value) {
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO metas (key, value) VALUES (@key, @value)',
  );
  stmt.run({ key, value: JSON.stringify(value) });
}
