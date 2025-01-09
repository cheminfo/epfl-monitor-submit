import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function DebugDataState() {
  useSignals();
  const state = getState();

  return <pre>{JSON.stringify(state.data, null, 2)}</pre>;
}
