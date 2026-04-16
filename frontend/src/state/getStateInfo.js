import { signal } from '@preact/signals-react';

export const isLeaf = Symbol('isLeaf');
export const isSignal = Symbol('isSignal');

const preactSymbol = signal('').brand;

/**
 * We need to get initial information about the state in order
 * to merge later the new state
 * @param {object} state
 * @param stateInfo
 * @returns {object}
 */
export function getStateInfo(state, stateInfo = {}) {
  // Object.entries only returns enumerable properties = own properties
  for (const [key, entry] of Object.entries(state)) {
    if (isSignalCheck(entry)) {
      stateInfo[key] = {
        isSignal,
        isLeaf,
        type: typeof entry.value,
        initialValue: structuredClone(entry.value),
      };
    } else if (typeof entry === 'object') {
      stateInfo[key] = getStateInfo(entry);
    } else {
      stateInfo[key] = {
        isLeaf,
        type: typeof entry,
        initialValue: structuredClone(entry),
      };
    }
  }

  return stateInfo;
}

export function isSignalCheck(value) {
  return (
    value != null && typeof value === 'object' && value.brand === preactSymbol
  );
}
