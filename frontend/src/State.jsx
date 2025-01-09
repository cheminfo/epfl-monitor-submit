import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function State() {
  useSignals();
  const state = getState();
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
