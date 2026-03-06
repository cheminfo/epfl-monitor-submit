/**
 * Save a key-value pair in the metas table
 * @param {import('./getDB.js').DB} db - the database instance
 * @param {string} key - key to store
 * @param {unknown} value - value to store
 */
export function setMeta(db, key, value) {
  db.upsertMeta.run({ key, value: JSON.stringify(value) });
}
