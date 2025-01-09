import { signal, effect } from '@preact/signals-react';

const state = {
  data: {
    stats: signal({}),
  },
  view: {
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

effect(() => {
  // define url parameters
  const params = new URLSearchParams();
  params.append('query', state.view.query.value);
  fetch('http://127.0.0.1:50107/v1/search' + '?' + params.toString())
    .then((res) => res.json())
    .then((data) => {
      state.view.files.value = data;
    });
});

export default function getState() {
  return state;
}
