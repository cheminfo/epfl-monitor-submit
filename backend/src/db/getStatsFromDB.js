import { getMeta } from './getMeta.js';
import { updateStatsInDB } from './updateStatsInDB.js';

/**
 *
 * @param {InstanceType<import('better-sqlite3')>} db
 */
export function getStatsFromDB(db) {
  const stats = getMeta(db, 'stats');
  if (stats) {
    return stats;
  }
  return updateStatsInDB(db);
}
