import { expect, test } from 'vitest';

import { getTempDB } from '../getDB.js';
import { getMeta } from '../getMeta.js';
import { setMeta } from '../setMeta.js';

test('setMeta', async () => {
  const db = await getTempDB();
  const person1 = { name: 'John', age: 30, city: 'New York' };
  const person2 = { name: 'Jane', age: 25, city: 'San Francisco' };
  setMeta(db, 'person1', person1);
  setMeta(db, 'person2', person2);
  setMeta(db, 'boolean', true);
  setMeta(db, 'number', 42);
  setMeta(db, 'string', 'Hello, World!');

  expect(getMeta(db, 'person1')).toStrictEqual(person1);
  expect(getMeta(db, 'person2')).toStrictEqual(person2);
  expect(getMeta(db, 'boolean')).toBe(true);
  expect(getMeta(db, 'number')).toBe(42);
  expect(getMeta(db, 'string')).toBe('Hello, World!');
  db.close();
});
