import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export function SelectRange() {
  useSignals();
  return (
    <select
      value={state.view.range.value}
      onChange={(e) => {
        state.view.range.value = e.target.value;
      }}
    >
      <option value="lastMonth">Last month</option>
      <option value="last12Months">Last 12 months</option>
      <option value="total">All</option>
    </select>
  );
}
