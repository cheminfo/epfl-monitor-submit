const colorMapping = {
  to_process: {
    light: 'lightyellow',
    dark: 'yellow',
  },
  errored: {
    light: 'pink',
    dark: 'red',
  },
  processed: {
    light: 'lightgreen',
    dark: 'green',
  },
};

/**
 *
 * @param {string} status
 * @param {object} [options={}]
 * @param {boolean} [options.light=true]
 * @returns {string}
 */
export function getColorFromStatus(status, options = {}) {
  const { light = true } = options;
  return colorMapping[status]?.[light ? 'light' : 'dark'] || 'transparent';
}
