/**
 *
 * @param {InstanceType<import('better-sqlite3')>} db
 * @param {string} key
 * @param {unknown} value
 * @returns
 */
export function setMeta(db, key, value) {
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO metas (key, value) VALUES (@key, @value)',
  );
  stmt.run({ key, value: JSON.stringify(value) });
}
