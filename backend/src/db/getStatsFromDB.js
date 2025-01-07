import { getMeta } from './getMeta.js';
import { updateStatsInDB } from './updateStatsInDB.js';

/**
 * Returns various stats from the database
 * @param {InstanceType<import('better-sqlite3')>} db - the sqlite3 database
 * @returns {object}
 */
export function getStatsFromDB(db) {
  const stats = getMeta(db, 'stats');
  if (stats) {
    return stats;
  }
  return updateStatsInDB(db);
}
