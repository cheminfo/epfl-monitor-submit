import debugLibrary from 'debug';
import { search } from 'smart-sqlite3-filter';

const debug = debugLibrary('queryFiles');

/**
 * search for files based on a 'smart' query
 * @param {string} queryString - search query string like 'name:abc'
 * @param {InstanceType<import('better-sqlite3')>} db - the sqlite3 database
 * @param {object} [options={}] - object containing the options
 * @param {import('cheminfo-types').Logger} [options.logger] - optional logger that can return valuable debug information
 * @returns {Promise} - promise resolving to an array of files
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
