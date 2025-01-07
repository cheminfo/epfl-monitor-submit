import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { syncPath } from '../syncPath.js';

test('syncPath', async () => {
  const db = await getTempDB();

  const path = new URL('data', import.meta.url).pathname;

  await syncPath(db, path);

  const allEntries = db.prepare('SELECT * FROM files').all();
  console.log(allEntries);

  //  expect(db.prepare('SELECT * FROM path').all()).toMatchSnapshot();
});
