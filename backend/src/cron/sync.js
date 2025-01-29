import debugLibrary from 'debug';
import delay from 'delay';

import { getDB } from '../db/getDB.js';
import { updateStatsInDB } from '../db/updateStatsInDB.js';
import { getPath } from '../utils/getPath.js';

import { syncPath } from './syncPath.js';

const debug = debugLibrary('sync');

const dataPath = getPath();

/**
 * Sync the data path with the database inside an infinite loop
 */
export async function cronSync() {
  while (true) {
    const db = await getDB();
    await syncPath(db, dataPath).catch((error) => debug(error));
    updateStatsInDB(db);
    debug('Waiting 1h');
    await delay(60 * 60 * 1000);
  }
}

await cronSync()
  .then(() => debug('End of process'))
  .catch((error) => debug(error));
