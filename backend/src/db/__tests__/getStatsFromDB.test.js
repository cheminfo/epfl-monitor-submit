import { test, expect } from 'vitest';
import { getTempDB } from '../getDB.js';
import { syncPath } from '../../cron/syncPath.js';
import { getStatsFromDB } from '../getStatsFromDB.js';

test('filesStats', async () => {
  const db = await getTempDB();

  const path = new URL('../../cron/__tests__/data', import.meta.url).pathname;

  await syncPath(db, path);

  const result = await getStatsFromDB(db);
  expect(Object.keys(result)).toStrictEqual([
    'lastUpdate',
    'nbFiles',
    'instruments',
    'statuses',
    'perYears',
    'perMonths',
  ]);
});
