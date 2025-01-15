import { SelectRange } from './SelectRange.jsx';
import styled from '@emotion/styled';

export function Header() {
  const Container = styled.div`
    background-color: #ccc;
    border: 1px solid #000;
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
