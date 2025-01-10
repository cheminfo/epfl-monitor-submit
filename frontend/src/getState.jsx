import { signal } from '@preact/signals-react';

export const state = {
  data: {
    stats: signal({}),
  },
  view: {
    range: signal('lastMonth'),
    query: signal(''),
    files: signal([]),
  },
  preferences: {},
  temp: {
    form: {
      value1: signal('test1'),
      value2: signal('test2'),
    },
  },
};
