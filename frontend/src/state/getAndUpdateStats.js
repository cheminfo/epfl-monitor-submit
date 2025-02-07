import { signal } from '@preact/signals-react';

import { getBackendURL } from '../utils/getBackendURL.js';

export function getAndUpdateStats() {
  const stats = signal({});

  function fetchStats() {
    fetch(`${getBackendURL()}/v1/stats`)
      .then((res) => res.json())
      .then((data) => {
        stats.value = data;
      });
  }
  fetchStats();
  setInterval(fetchStats, 60 * 1000);

  return stats;
}
