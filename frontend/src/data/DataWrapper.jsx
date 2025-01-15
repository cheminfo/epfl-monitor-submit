import { InstrumentTable } from './InstrumentTable.jsx';
import { Files } from './Files.jsx';
import styled from '@emotion/styled';

export function DataWrapper() {
  const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #eee;
  `;

  return (
    <Container>
      <InstrumentTable />
      <Files />
    </Container>
  );
}
