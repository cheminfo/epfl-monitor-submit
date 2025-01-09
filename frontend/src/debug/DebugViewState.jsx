import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export default function DebugViewState() {
  useSignals();

  return (
    <pre>
      {Math.random()}
      {JSON.stringify(state.view, undefined, 2)}
    </pre>
  );
}
