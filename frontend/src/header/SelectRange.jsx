import { state } from '../state/state.js';
import { Select } from '@blueprintjs/select';
import { Button, MenuItem } from '@blueprintjs/core';

const items = [
  { value: 'lastMonth', label: 'Last month' },
  { value: 'last12Months', label: 'Last 12 months' },
  { value: 'total', label: 'All' },
];

const itemRenderer = (item, { handleClick, handleFocus, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.value}
      onClick={handleClick}
      onFocus={handleFocus}
      text={item.label}
    />
  );
};

export function SelectRange() {
  return (
    <div style={{ width: '200px', backgroundColor: 'red' }}>
      <Select
        items={items}
        itemRenderer={itemRenderer}
        filterable={false}
        onItemSelect={(item) => {
          state.preferences.range.value = item.value;
        }}
      >
        <Button
          fill={true}
          alignText="left"
          text={
            items.find((item) => item.value === state.preferences.range.value)
              ?.label
          }
          rightIcon="caret-down"
        />
      </Select>
    </div>
  );
}
