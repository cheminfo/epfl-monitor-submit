import { useSignals } from '@preact/signals-react/runtime';
import getState from '../getState.jsx';
import InputField from './InputField.jsx';

export default function Form() {
  useSignals();
  const state = getState();

  const form = state.temp.form;

  return (
    <div>
      <InputField signal={form.value1} />
      <InputField signal={form.value2} />
    </div>
  );
}
