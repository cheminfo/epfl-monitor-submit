import { signal } from '@preact/signals-react';

import { getAndManagePreferences } from './getAndManagePreferences.js';
import { getAndUpdateStats } from './getAndUpdateStats.js';

export const state = {
  uuid: 'b9ad32ff-caa8-3dfd-1697-fc4a8dd79bcc',
  data: {
    stats: getAndUpdateStats(),
  },
  view: {
    query: signal(''),
    files: signal([]),
    statusFilter: signal(null),
    offset: signal(0),
    totalCount: signal(0),
    statusCounts: signal({}),
  },
  preferences: getAndManagePreferences(),
};
