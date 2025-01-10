import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export function DebugDataState() {
  useSignals();
  return (
    // make the pre take the space left vertically
    // and make it scrollable
    // and show the data
    <pre>
      {Math.random()}
      {JSON.stringify(state.data, undefined, 2)}
    </pre>
  );
}
