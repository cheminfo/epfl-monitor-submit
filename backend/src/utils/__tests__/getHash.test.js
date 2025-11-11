import { expect, test } from 'vitest';

import { getHash } from '../getHash.js';

test('getHash', async () => {
  const data = new TextEncoder().encode('Hello, World!');
  const hash = await getHash(data);
  expect(hash).toBe(
    'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f',
  );
});
