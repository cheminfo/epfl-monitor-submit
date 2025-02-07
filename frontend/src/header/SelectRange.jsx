import { state } from '../state/state.js';
import { Select } from '@blueprintjs/select';
import { Button } from '@blueprintjs/core';

const items = [
  { value: 'lastMonth', label: 'Last month' },
  { value: 'last12Months', label: 'Last 12 months' },
  { value: 'total', label: 'All' },
];

export function SelectRange() {
  return (
    <div style={{ width: '200px', backgroundColor: 'red' }}>
      <Select
        items={items}
        itemRenderer={(item, { handleClick }) => (
          <div key={item.value} onClick={handleClick}>
            {item.label}
          </div>
        )}
        filterable={false}
        fill={true}
        onItemSelect={(item) => {
          state.preferences.range.value = item.value;
        }}
      >
        <Button
          text={
            items.find((item) => item.value === state.preferences.range.value)
              ?.label
          }
          rightIcon="double-caret-vertical"
        />
      </Select>
    </div>
  );
}
