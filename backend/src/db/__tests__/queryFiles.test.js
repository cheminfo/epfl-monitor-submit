import { test, expect } from 'vitest';
import { getTempDB } from '../getDB.js';
import { syncPath } from '../../cron/syncPath.js';
import { queryFiles } from '../queryFiles.js';

test('queryFiles', async () => {
  const db = await getTempDB();

  const path = new URL('../../cron/__tests__/data', import.meta.url).pathname;

  await syncPath(db, path);

  const result = await queryFiles('name:a', db);
  const names = result.map((entry) => entry.name);
  expect(names).toStrictEqual(['a.err.jdx', 'a.proc.jdx', 'a.to.jdx']);
});
