import { InputGroup } from '@blueprintjs/core';
import { effect } from '@preact/signals-react';

import { PAGE_SIZE } from '../components/Pagination.jsx';
import { state } from '../state/state.js';
import { getBackendURL } from '../utils/getBackendURL.js';

effect(() => {
  const params = new URLSearchParams();
  const range = state.preferences.range.value;
  const lastModified = getLastModified(range);
  const statusFilter = state.view.statusFilter.value;
  const offset = state.view.offset.value;

  let query = state.view.query.value;
  if (statusFilter) {
    query += ` status:${statusFilter}`;
  }
  if (lastModified) {
    query += ` lastModified:>${lastModified}`;
  }

  params.append('query', query);
  params.append('limit', String(PAGE_SIZE));
  params.append('offset', String(offset));

  fetch(`${getBackendURL()}/v1/search?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      state.view.files.value = data;
      state.view.totalCount.value = data.totalCount || 0;
      state.view.statusCounts.value = data.statusCounts || {};
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
        onValueChange={(value) => {
          querySignal.value = value;
          state.view.offset.value = 0;
        }}
      />
    </div>
  );
}
