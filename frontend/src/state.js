import { effect, signal } from '@preact/signals-react';

const preactSymbol = signal('').constructor.prototype.brand;
const isLeeve = Symbol('isLeeve');
const isSignal = Symbol('isSignal');

export const state = {
  uuid: 'b9ad32ff-caa8-3dfd-1697-fc4a8dd79bcc',
  data: {
    stats: signal({}),
  },
  view: {
    query: signal(''),
    files: signal([]),
  },
  preferences: {
    range: signal('lastMonth'),
  },
};

/**
 *
 * @param {object} state
 * @param stateInfo
 * @returns {object}
 */
function getStateInfo(state, stateInfo = {}) {
  // Object.entries only returns enumerable properties = own properties
  for (const [key, entry] of Object.entries(state)) {
    if (isSignalCheck(entry)) {
      stateInfo[key] = {
        isSignal,
        isLeeve,
        type: typeof entry.value,
        initialValue: structuredClone(entry.value),
      };
    } else if (typeof entry === 'object') {
      stateInfo[key] = getStateInfo(entry);
    } else {
      stateInfo[key] = {
        isLeeve,
        type: typeof entry,
        initialValue: structuredClone(entry),
      };
    }
  }

  return stateInfo;
}

const stateInfo = getStateInfo(state);

function isSignalCheck(value) {
  return value.brand === preactSymbol;
}

/**
 * Function that will update the state with new values
 * Only leeves can be updated
 * @param newState
 */
export function updateState(newState) {
  updateStateInternal(stateInfo, state, newState);
}

function updateStateInternal(stateInfo, localState, newState) {
  for (const key in stateInfo) {
    if (newState[key] === undefined) {
      continue;
    }
    if (typeof stateInfo[key] === 'object') {
      if (stateInfo[key].isSignal === isSignal) {
        localState[key].value = newState[key];
      } else if (stateInfo[key].isLeeve === isLeeve) {
        // leaves that are not signals are read-only !
        throw new Error(
          `Cannot update leaf ${key} with value ${newState[key]}`,
        );
      } else {
        updateStateInternal(stateInfo[key], localState[key], newState[key]);
      }
    }
  }
}

loadPreferences();

function loadPreferences() {
  const preferences = localStorage.getItem('preferences');
  if (preferences) {
    updateState(JSON.parse(preferences));
  }

  effect(() => {
    const subState = {
      // need to keep JSON.parse(JSON.stringify()) to remove signals
      // eslint-disable-next-line unicorn/prefer-structured-clone
      preferences: JSON.parse(JSON.stringify(state.preferences)),
    };
    const stringifiedState = JSON.stringify(subState);
    if (localStorage.getItem('preferences') === stringifiedState) {
      return;
    }
    localStorage.setItem('preferences', stringifiedState);
  });
}
