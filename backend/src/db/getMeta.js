/**
 * get a record from the metas table
 * @param {InstanceType<import('better-sqlite3')>} db
 * @param {string} key
 * @returns {string|number|boolean|object|undefined}
 */
export function getMeta(db, key) {
  const stmt = db.prepare('SELECT value FROM metas WHERE key=@key');
  const results = stmt.all({ key });
  if (results.length > 1) {
    throw new Error(`More than one result found for key: ${key}`);
  }
  if (results.length === 0) {
    return undefined;
  }
  return JSON.parse(results[0].value);
}
