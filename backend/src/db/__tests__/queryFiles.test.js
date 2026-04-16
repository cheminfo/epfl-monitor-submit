import { expect, test } from 'vitest';

import { syncPath } from '../../cron/syncPath.js';
import { getTempDB } from '../getDB.js';
import { queryFiles, queryFilesPage } from '../queryFiles.js';

test('queryFiles', async () => {
  const db = await getTempDB();

  const path = new URL('../../../../data', import.meta.url).pathname;

  await syncPath(db, path);

  const result = await queryFiles('name:a', db);
  const names = result.map((entry) => entry.name);
  expect(names).toStrictEqual(['a.err.jdx', 'a.proc.jdx', 'a.to.jdx']);
});

test('queryFilesPage', async () => {
  const db = await getTempDB();
  const path = new URL('../../../../data', import.meta.url).pathname;
  await syncPath(db, path);

  const { entries, totalCount, statusCounts } = await queryFilesPage('', db, {
    limit: 2,
    offset: 0,
  });

  expect(entries).toHaveLength(2);
  expect(totalCount).toBeGreaterThan(2);
  expect(statusCounts).toHaveProperty('processed');
  expect(statusCounts).toHaveProperty('to_process');
});

test('queryFilesPage with status filter', async () => {
  const db = await getTempDB();
  const path = new URL('../../../../data', import.meta.url).pathname;
  await syncPath(db, path);

  const { entries, statusCounts } = await queryFilesPage(
    'status:processed',
    db,
    { limit: 50, offset: 0 },
  );

  for (const entry of entries) {
    expect(entry.status).toBe('processed');
  }
  // statusCounts should reflect counts without the status filter
  expect(Object.keys(statusCounts).length).toBeGreaterThan(1);
});
