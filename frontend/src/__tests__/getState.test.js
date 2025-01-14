import { state, getStateInfo, updateState } from '../getState';
import { test, expect } from 'vitest';

test('getState', () => {
  expect(JSON.parse(JSON.stringify(state))).toStrictEqual({
    data: { stats: {} },
    view: { query: '', files: [] },
    preferences: { range: 'lastMonth' },
    temp: { form: { value1: 'test1', value2: 'test2' } },
  });

  updateState({ temp: { form: { value1: 'test3' } } });

  expect(JSON.parse(JSON.stringify(state))).toStrictEqual({
    data: { stats: {} },
    view: { query: '', files: [] },
    preferences: { range: 'lastMonth' },
    temp: { form: { value1: 'test3', value2: 'test2' } },
  });

  // console.log(state.temp.form);
  // console.log(stateInfo);
});
