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
  temp: {
    form: {
      value1: signal('test1'),
      value2: signal('test2'),
    },
  },
};

/**
 *
 * @param {Object} state
 * @returns {Object}
 */
function getStateInfo(state, stateInfo = {}) {
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      if (isSignalCheck(state[key])) {
        stateInfo[key] = {
          isSignal,
          isLeeve,
          type: typeof state[key].value,
          initialValue: structuredClone(state[key].value),
        };
      } else if (typeof state[key] === 'object') {
        stateInfo[key] = getStateInfo(state[key]);
      } else {
        stateInfo[key] = {
          isLeeve,
          type: typeof state[key],
          initialValue: structuredClone(state[key]),
        };
      }
    }
  }

  return stateInfo;
}

const stateInfo = getStateInfo(state);

function isSignalCheck(value) {
  return value.constructor.prototype.brand === preactSymbol;
}

/**
 * Function that will update the state with new values
 * Only leeves can be updated
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
      preferences: JSON.parse(JSON.stringify(state.preferences)),
    };
    const stringifiedState = JSON.stringify(subState);
    if (localStorage.getItem('preferences') === stringifiedState) {
      return;
    }
    localStorage.setItem('preferences', stringifiedState);
  });
}
