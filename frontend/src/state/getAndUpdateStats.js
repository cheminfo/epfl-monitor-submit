import { signal } from '@preact/signals-react';

import { getBackendURL } from '../utils/getBackendURL.js';

export function getAndUpdateStats() {
  const stats = signal({});

  function fetchStats() {
    fetch(`${getBackendURL()}/v1/stats`)
      .then((response) => response.json())
      .then((data) => {
        stats.value = data;
      })
      .catch((error) => {
        console.error('Failed to fetch stats:', error);
      });
  }
  fetchStats();
  setInterval(fetchStats, 60 * 1000);

  return stats;
}
