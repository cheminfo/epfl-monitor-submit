import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export default function DebugDataState() {
  useSignals();
  return (
    <pre>
      {Math.random()}
      {JSON.stringify(state.data, undefined, 2)}
    </pre>
  );
}
