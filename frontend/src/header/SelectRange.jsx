import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { state } from '../state/state.js';

const items = [
  { value: 'lastWeek', label: 'Last week' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'last3Months', label: 'Last 3 months' },
  { value: 'last6Months', label: 'Last 6 months' },
  { value: 'last12Months', label: 'Last 12 months' },
  { value: 'total', label: 'All' },
];

const itemRenderer = (item, { handleClick, handleFocus, modifiers }) => {
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
    <Select
      items={items}
      itemRenderer={itemRenderer}
      filterable={false}
      onItemSelect={(item) => {
        state.preferences.range.value = item.value;
      }}
    >
      <Button
        alignText="left"
        text={
          items.find((item) => item.value === state.preferences.range.value)
            ?.label
        }
        rightIcon="caret-down"
        style={{ minWidth: 150 }}
      />
    </Select>
  );
}
