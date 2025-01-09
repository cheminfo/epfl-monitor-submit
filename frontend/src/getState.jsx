import { signal } from '@preact/signals-react';

const state = {
  data: {
    stats: signal({}),
  },
  view: {
    query: signal(''),
    files: signal([]),
  },
  preferences: {},
};

export default function getState() {
  return state;
}
