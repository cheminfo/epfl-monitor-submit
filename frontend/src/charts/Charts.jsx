import { Section } from '@blueprintjs/core';
import { Pie } from './Pie';
import { Bar } from './Bar.jsx';

export function Charts() {
  return (
    <Section title="Charts">
      <div style={{ display: 'flex' }}>
        <div style={{ height: '400px', width: '50%' }}>
          <Pie />
        </div>
        <div style={{ height: '400px', width: '50%' }}>
          <Bar />
        </div>
      </div>
    </Section>
  );
}
