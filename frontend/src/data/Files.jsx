import { Section } from '@blueprintjs/core';

import { FilesTable } from './FilesTable.jsx';
import { QueryFiles } from './QueryFiles.jsx';

export function Files(props) {
  const { gridArea } = props;
  return (
    <Section title="List of files" style={{ gridArea, overflow: 'auto' }}>
      <QueryFiles />
      <FilesTable />
    </Section>
  );
}
