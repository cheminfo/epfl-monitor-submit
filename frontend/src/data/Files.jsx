import { Section } from '@blueprintjs/core';
import { QueryFiles } from './QueryFiles.jsx';
import { FilesTable } from './FilesTable.jsx';

export function Files() {
  return (
    <Section title="List of files" style={{ overflowY: 'auto' }}>
      <QueryFiles />
      <FilesTable />
    </Section>
  );
}
