import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';
import { InputGroup } from '@blueprintjs/core';

import { effect } from '@preact/signals-react';

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

export default function Query() {
  useSignals();
  const querySignal = state.view.query;

  return (
    <div>
      <InputGroup
        type="search"
        leftIcon="search"
        value={querySignal.value}
        onValueChange={(value) => (querySignal.value = value)}
      />
    </div>
  );
}
