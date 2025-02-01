import { Section } from '@blueprintjs/core';
import { QueryFiles } from './QueryFiles.jsx';
import { FilesTable } from './FilesTable.jsx';

export function Files(props) {
  const { gridArea } = props;
  return (
    <Section title="List of files" style={{ gridArea, overflow: 'auto' }}>
      <QueryFiles />
      <FilesTable />
    </Section>
  );
}
