import { Card, Section } from '@blueprintjs/core';
import { Pie } from './Pie';
import { Bar } from './Bar.jsx';
import styled from '@emotion/styled';

export function Charts() {
  const Container = styled.div`
    display: grid;
    background-color: #ddd;
  `;

  return (
    <Container>
      <Section title="Charts">
        <Card style={{ display: 'flex' }}>
          <Card style={{ height: '400px', width: '50%' }}>
            <div style={{ fontSize: '1.5em', textAlign: 'center' }}>
              Status of the files
            </div>
            <Pie />
          </Card>
          <Card style={{ height: '400px', width: '50%' }}>
            <div style={{ fontSize: '1.5em', textAlign: 'center' }}>
              Evolution over the past year
            </div>
            <Bar />
          </Card>
        </Card>
      </Section>
    </Container>
  );
}
