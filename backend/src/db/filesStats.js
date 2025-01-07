import debugLibrary from 'debug';
import { search } from 'smart-sqlite3-filter';

const debug = debugLibrary('filesStats');

/**
 * @param {InstanceType<import('better-sqlite3')>} db
 * @param {object} [options={}]
 * @param {import('cheminfo-types').Logger} [options.logger]
 */
export async function filesStats(db, options = {}) {
  const stats = {};

  return stats;
}
