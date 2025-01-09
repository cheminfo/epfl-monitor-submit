import { useSignals } from '@preact/signals-react/runtime';
import { state } from './getState.jsx';
import { InputGroup } from '@blueprintjs/core';

export default function Query() {
  useSignals();
  const querySignal = state.view.query;

  return (
    <div>
      <InputGroup
        type="search"
        leftIcon="search"
        onValueChange={(value) => (querySignal.value = value)}
      />
    </div>
  );
}
