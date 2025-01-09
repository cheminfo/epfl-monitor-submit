import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';
import { Card, FormGroup, InputGroup } from '@blueprintjs/core';

export default function Form() {
  useSignals();

  const form = state.temp.form;

  return (
    <Card>
      <FormGroup label="Value 1">
        <InputGroup
          value={form.value1.value}
          onValueChange={(value) => (form.value1.value = value)}
        />
      </FormGroup>
      <FormGroup label="Value 2">
        <InputGroup
          value={form.value2.value}
          onValueChange={(value) => (form.value2.value = value)}
        />
      </FormGroup>
    </Card>
  );
}
