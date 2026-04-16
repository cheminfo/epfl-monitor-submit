import { getMeta } from './getMeta.js';
import { updateStatsInDB } from './updateStatsInDB.js';

const MAX_STATS_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Returns various stats from the database, recomputing if stale.
 * @param {import('./getDB.js').DB} db - the database instance
 * @returns {object} - object containing the stats
 */
export function getStatsFromDB(db) {
  const stats = getMeta(db, 'stats');
  if (stats && Date.now() - stats.lastUpdate < MAX_STATS_AGE_MS) {
    return stats;
  }
  return updateStatsInDB(db);
}
