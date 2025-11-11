import { InputGroup } from '@blueprintjs/core';
import { effect } from '@preact/signals-react';

import { state } from '../state/state.js';
import { getBackendURL } from '../utils/getBackendURL.js';

effect(() => {
  // define url parameters
  const params = new URLSearchParams();
  const range = state.preferences.range.value;
  const lastModified = getLastModified(range);
  params.append(
    'query',
    state.view.query.value +
      (lastModified ? ` lastModified:>${lastModified}` : ''),
  );
  fetch(`${getBackendURL()}/v1/search?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => {
      state.view.files.value = data;
    });
});

function getLastModified(range) {
  switch (range) {
    case 'lastMonth':
      return new Date().setMonth(new Date().getMonth() - 1);
    case 'last12Months':
      return new Date().setFullYear(new Date().getFullYear() - 1);
    case 'all':
      return undefined;
    default:
      return undefined;
  }
}

export function QueryFiles() {
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
