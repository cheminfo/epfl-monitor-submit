import { Section } from '@blueprintjs/core';
import { DebugTempState } from './DebugTempState.jsx';
import { Form } from './Form.jsx';

export function Test() {
  return (
    <Section title="Simple test case changing the temp state">
      <div style={{ display: 'flex' }}>
        <div style={{ width: '33%' }}>
          <Form />
        </div>
        <div style={{ width: '33%' }}>
          <h3>Debug temp</h3>
          <DebugTempState />
        </div>
        <div style={{ width: '33%' }}>
          <Form />
        </div>
      </div>
    </Section>
  );
}
