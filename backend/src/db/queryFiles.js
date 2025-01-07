import debugLibrary from 'debug';
import { search } from 'smart-sqlite3-filter';

const debug = debugLibrary('queryFiles');

/**
 * @param {string} queryString
 * @param {InstanceType<import('better-sqlite3')>} db
 * @param {object} [options={}]
 * @param {import('cheminfo-types').Logger} [options.logger]
 */

export async function queryFiles(queryString, db, options = {}) {
  debug(`Searching for: ${queryString}`);
  const entries = search(queryString, db, {
    tableName: 'files',
    orderBy: 'lastModified desc',
    logger: options.logger,
  });
  return entries;
}
