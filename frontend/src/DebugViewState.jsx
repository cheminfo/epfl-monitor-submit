import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function DebugViewState() {
  useSignals();
  const state = getState();

  return <pre>{JSON.stringify(state.view, null, 2)}</pre>;
}
