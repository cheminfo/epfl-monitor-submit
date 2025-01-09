import { useSignals } from '@preact/signals-react/runtime';
import { state } from './getState.jsx';

export default function State() {
  useSignals();
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
