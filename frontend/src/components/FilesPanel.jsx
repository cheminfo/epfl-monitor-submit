import { Section } from '@blueprintjs/core';

import { FilesTable } from '../data/FilesTable.jsx';
import { QueryFiles } from '../data/QueryFiles.jsx';
import { state } from '../state/state.js';

import { Pagination } from './Pagination.jsx';
import { StatusFilter } from './StatusFilter.jsx';

export function FilesPanel() {
  const offset = state.view.offset.value;
  const totalCount = state.view.totalCount.value;

  function handleOffsetChange(newOffset) {
    state.view.offset.value = newOffset;
  }

  return (
    <div style={{ padding: 16 }}>
      <Section title="List of files">
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <QueryFiles />
          <StatusFilter />
        </div>
        <Pagination
          offset={offset}
          total={totalCount}
          onOffsetChange={handleOffsetChange}
        />
        <FilesTable />
        <Pagination
          offset={offset}
          total={totalCount}
          onOffsetChange={handleOffsetChange}
        />
      </Section>
    </div>
  );
}
