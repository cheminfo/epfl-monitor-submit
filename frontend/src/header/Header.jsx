import { SelectRange } from './SelectRange.jsx';
import styled from '@emotion/styled';

export function Header(props) {
  const { gridArea } = props;
  const Container = styled.div`
    grid-area: ${gridArea};
    justify-self: center;
    align-content: center;
  `;

  return (
    <Container>
      <SelectRange />
    </Container>
  );
}
