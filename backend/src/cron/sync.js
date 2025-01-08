import debugLibrary from 'debug';
import delay from 'delay';

import { getDB } from '../db/getDB.js';

import { syncPath } from './syncPath.js';

const debug = debugLibrary('sync');

const dataPath =
  process.env.DATA_PATH || new URL('__tests__/data', import.meta.url).pathname;

export async function cronSync() {
  const db = await getDB();
  await syncPath(db, dataPath).catch((error) => debug(error));
  debug('Waiting 1h');
  await delay(60 * 60 * 1000);
}

await cronSync()
  .then(() => debug('End of process'))
  .catch((error) => debug(error));
