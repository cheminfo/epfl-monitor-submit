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
    })
    .catch((error) => {
      console.error('Failed to fetch files:', error);
    });
});

function getLastModified(range) {
  const now = new Date();
  switch (range) {
    case 'lastWeek':
      return now.setDate(now.getDate() - 7);
    case 'lastMonth':
      return now.setMonth(now.getMonth() - 1);
    case 'last3Months':
      return now.setMonth(now.getMonth() - 3);
    case 'last6Months':
      return now.setMonth(now.getMonth() - 6);
    case 'last12Months':
      return now.setFullYear(now.getFullYear() - 1);
    case 'total':
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
