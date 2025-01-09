import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function DebugViewState() {
  useSignals();
  const state = getState();

  return (
    <pre>
      {Math.random()}
      {JSON.stringify(state.view, undefined, 2)}
    </pre>
  );
}
