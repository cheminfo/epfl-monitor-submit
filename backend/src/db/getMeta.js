/**
 * Get a record from the metas table
 * @param {import('./getDB.js').DB} db - the database instance
 * @param {string} key - key of the parameter
 * @returns {string|number|boolean|object|undefined} - the value of the parameter
 */
export function getMeta(db, key) {
  const results = db.selectMetaByKey.all({ key });
  if (results.length > 1) {
    throw new Error(`More than one result found for key: ${key}`);
  }
  if (results.length === 0) {
    return undefined;
  }
  return JSON.parse(results[0].value);
}
