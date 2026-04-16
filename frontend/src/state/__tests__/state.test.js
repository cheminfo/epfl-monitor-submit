/* eslint-disable unicorn/prefer-structured-clone */
import { beforeEach, expect, test, vi } from 'vitest';

vi.stubGlobal('localStorage', {
  store: {},
  getItem: vi.fn((key) => localStorage.store[key] ?? null),
  setItem: vi.fn((key, value) => {
    localStorage.store[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorage.store[key];
  }),
  clear: vi.fn(() => {
    localStorage.store = {};
  }),
});

vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })),
);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.store = {};
});

const { state } = await import('../state.js');
const { getStateInfo } = await import('../getStateInfo.js');
const { updateState } = await import('../updateState.js');

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
