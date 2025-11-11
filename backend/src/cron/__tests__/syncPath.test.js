import { expect, test } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { syncPath } from '../syncPath.js';

test('syncPath', async () => {
  const db = await getTempDB();

  const path = new URL('../../../../data', import.meta.url).pathname;

  await syncPath(db, path);

  const allEntries = db.prepare('SELECT * FROM files').all();
  const paths = allEntries.map((entry) => entry.relativePath);
  expect(paths).toStrictEqual([
    'ir3404/processed/a.proc.jdx',
    'ir3404/processed/2024/01/01/b.proc.jdx',
    'ms1520/processed/c.proc.jdx',
    'ms1520/processed/d.proc.jdx',
    'ir3404/errored/a.err.jdx',
    'ir3404/errored/b.err.jdx',
    'ms1520/errored/c.err.jdx',
    'ir3404/to_process/a.to.jdx',
    'ir3404/to_process/b.to.jdx',
    'ms1520/to_process/c.to.jdx',
    'ms1520/to_process/d.err.jdx',
    'ms1520/to_process/d.to.jdx',
  ]);
});
