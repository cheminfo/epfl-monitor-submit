import { effect } from '@preact/signals-react';

import { state } from '../state/state.js';

effect(() => {
  const subState = {
    preferences: JSON.stringify(JSON.parse(state.preferences)),
  };
  const stringifiedState = JSON.stringify(subState);
  if (localStorage.getItem('preferences') === stringifiedState) {
    return;
  }
  localStorage.setItem('preferences', stringifiedState);
});
