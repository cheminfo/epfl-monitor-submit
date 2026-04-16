import { Section } from '@blueprintjs/core';

import { FilesTable } from '../data/FilesTable.jsx';
import { QueryFiles } from '../data/QueryFiles.jsx';

export function FilesPanel() {
  return (
    <div style={{ padding: 16 }}>
      <Section title="List of files">
        <QueryFiles />
        <FilesTable />
      </Section>
    </div>
  );
}
