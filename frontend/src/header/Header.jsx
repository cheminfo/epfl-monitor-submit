import { SelectRange } from './SelectRange.jsx';
import styled from '@emotion/styled';

const Container = styled.div`
  grid-area: ${(props) => props.gridArea};
  justify-self: center;
  align-content: center;
`;

export function Header(props) {
  const { gridArea } = props;
  return (
    <Container gridArea={gridArea}>
      <SelectRange />
    </Container>
  );
}
