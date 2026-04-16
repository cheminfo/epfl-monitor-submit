import { Tag } from '@blueprintjs/core';

import { getColorFromStatus } from '../data/getColorFromStatus.js';
import { state } from '../state/state.js';

const STATUS_ORDER = ['processed', 'to_process', 'errored'];

const STATUS_LABELS = {
  processed: 'Processed',
  // eslint-disable-next-line camelcase
  to_process: 'To process',
  errored: 'Errored',
};

export function StatusFilter() {
  const statusCounts = state.view.statusCounts.value;
  const activeStatus = state.view.statusFilter.value;

  const total = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  function handleStatusChange(status) {
    state.view.statusFilter.value = status;
    state.view.offset.value = 0;
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tag
        interactive
        minimal={activeStatus !== null}
        onClick={() => handleStatusChange(null)}
        style={{ cursor: 'pointer' }}
      >
        all ({total})
      </Tag>
      {STATUS_ORDER.map((status) => {
        const count = statusCounts[status] || 0;
        if (count === 0) return null;
        const isActive = activeStatus === status;
        const color = getColorFromStatus(status, { light: false });
        return (
          <Tag
            key={status}
            interactive
            minimal={!isActive}
            onClick={() => handleStatusChange(isActive ? null : status)}
            style={{
              cursor: 'pointer',
              backgroundColor: isActive ? color : undefined,
              color: isActive ? '#fff' : color,
            }}
          >
            {STATUS_LABELS[status]} ({count})
          </Tag>
        );
      })}
    </div>
  );
}
