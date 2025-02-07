import { effect, signal } from '@preact/signals-react';

import { getStateInfo } from './getStateInfo.js';
import { updateState } from './updateState.js';

export function getAndManagePreferences() {
  const state = {
    range: signal('lastMonth'),
  };
  const stateInfo = getStateInfo(state);

  const preferences = localStorage.getItem('preferences');
  if (preferences) {
    updateState(state, stateInfo, JSON.parse(preferences));
  }

  // save the preferences in the localStorage
  effect(() => {
    // need to keep JSON.parse(JSON.stringify()) to remove signals
    // eslint-disable-next-line unicorn/prefer-structured-clone
    const stateCopy = JSON.parse(JSON.stringify(state));
    const stringifiedState = JSON.stringify(stateCopy);
    if (localStorage.getItem('preferences') === stringifiedState) {
      return;
    }
    localStorage.setItem('preferences', stringifiedState);
  });

  return state;
}
