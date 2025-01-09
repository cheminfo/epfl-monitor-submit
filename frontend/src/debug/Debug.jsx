import { Section } from '@blueprintjs/core';
import { DebugDataState } from './DebugDataState.jsx';
import { DebugViewState } from './DebugViewState.jsx';

export function Debug() {
  return (
    <Section title="Debug information">
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <h3>Debug Data State</h3>
          <DebugDataState />
        </div>
        <div style={{ width: '50%' }}>
          <h3>Debug View State</h3>
          <DebugViewState />
        </div>
      </div>
    </Section>
  );
}
