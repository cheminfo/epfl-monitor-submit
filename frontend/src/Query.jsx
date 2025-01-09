import { useSignals } from '@preact/signals-react/runtime';
import getState from './getState.jsx';

export default function Query() {
  useSignals();
  const querySignal = getState().view.query;

  return (
    <div>
      <input
        type="text"
        value={querySignal.value}
        onInput={(e) => {
          querySignal.value = e.target.value;
        }}
      />
    </div>
  );
}
