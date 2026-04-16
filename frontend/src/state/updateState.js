import { isLeaf, isSignal } from './getStateInfo.js';

/**
 * Function that will update the state with new values
 * Only leeves can be updated
 * @param state
 * @param stateInfo
 * @param newState
 */
export function updateState(state, stateInfo, newState) {
  for (const key in stateInfo) {
    if (newState[key] === undefined) {
      continue;
    }
    if (typeof stateInfo[key] === 'object') {
      if (stateInfo[key].isSignal === isSignal) {
        state[key].value = newState[key];
      } else if (stateInfo[key].isLeaf === isLeaf) {
        // leaves that are not signals are read-only !
        throw new Error(
          `Cannot update leaf ${key} with value ${newState[key]}`,
        );
      } else {
        updateState(state[key], stateInfo[key], newState[key]);
      }
    }
  }
}
