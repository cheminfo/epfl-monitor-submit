import { state } from '../getState.jsx';

import { effect } from '@preact/signals-react';

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
