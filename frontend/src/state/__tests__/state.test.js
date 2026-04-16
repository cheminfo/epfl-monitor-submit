/* eslint-disable unicorn/prefer-structured-clone */
import { expect, test } from 'vitest';

import { getStateInfo } from '../getStateInfo.js';
import { state } from '../state.js';
import { updateState } from '../updateState.js';

test('state', () => {
  expect(JSON.parse(JSON.stringify(state))).toStrictEqual({
    uuid: 'b9ad32ff-caa8-3dfd-1697-fc4a8dd79bcc',
    data: { stats: {} },
    view: { query: '', files: [] },
    preferences: { range: 'lastMonth' },
  });
  const stateInfo = getStateInfo(state);

  updateState(state, stateInfo, {
    view: { query: 'the query', value1: 'test3' },
  });

  expect(JSON.parse(JSON.stringify(state))).toStrictEqual({
    uuid: 'b9ad32ff-caa8-3dfd-1697-fc4a8dd79bcc',
    data: { stats: {} },
    view: { query: 'the query', files: [] },
    preferences: { range: 'lastMonth' },
  });
});
