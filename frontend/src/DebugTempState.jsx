import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function DebugTempState() {
  useSignals();
  const state = getState();

  return <pre>{JSON.stringify(state.temp, null, 2)}</pre>;
}
