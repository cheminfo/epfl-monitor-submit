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
    const stringifiedState = JSON.stringify(state);
    if (localStorage.getItem('preferences') === stringifiedState) {
      return;
    }
    localStorage.setItem('preferences', stringifiedState);
  });

  return state;
}
