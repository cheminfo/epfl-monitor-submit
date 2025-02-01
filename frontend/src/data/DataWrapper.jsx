import { InstrumentTable } from './InstrumentTable.jsx';
import { Files } from './Files.jsx';
import styled from '@emotion/styled';

export function DataWrapper(props) {
  const {gridRow, gridColumn} = props;
  const Container = styled.div`
    grid-row: ${gridRow};
    grid-column: ${gridColumn};
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
