import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export function DebugTempState() {
  useSignals();

  return <pre>{JSON.stringify(state.temp, null, 2)}</pre>;
}
