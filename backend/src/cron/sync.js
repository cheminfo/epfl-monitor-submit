/* eslint-disable no-await-in-loop */
import { setTimeout as delay } from 'node:timers/promises';

import pino from 'pino';

import { getDB } from '../db/getDB.js';
import { updateStatsInDB } from '../db/updateStatsInDB.js';
import { getPath } from '../utils/getPath.js';

import { syncPath } from './syncPath.js';

const logger = pino({ messageKey: 'sync' });

const dataPath = getPath();

/**
 * Sync the data path with the database inside an infinite loop
 */
export async function cronSync() {
  while (true) {
    logger.info(`Start sync: ${dataPath}`);
    const db = await getDB();
    await syncPath(db, dataPath).catch((error) => logger.error(error));
    updateStatsInDB(db);
    logger.info('Waiting 1h');
    await delay(60 * 60 * 1000);
  }
}

await cronSync()
  .then(() => logger.info('End of process'))
  .catch((error) => logger.error(error));
