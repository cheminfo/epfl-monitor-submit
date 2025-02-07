import { updateState } from '../state/state.js';

export function loadPreferences() {
  // load from localstorage the preferences
  const preferences = localStorage.getItem('preferences');
  if (preferences) {
    updateState(JSON.parse(preferences));
  }
}
