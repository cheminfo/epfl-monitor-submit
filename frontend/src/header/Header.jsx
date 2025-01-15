import { SelectRange } from './SelectRange.jsx';
import styled from '@emotion/styled';

export function Header() {
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  `;

  return (
    <Container>
      <SelectRange />
    </Container>
  );
}
