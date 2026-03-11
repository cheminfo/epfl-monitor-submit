const colorMapping = {
  // eslint-disable-next-line camelcase
  to_process: {
    light: '#fff8e1',
    dark: '#f9a825',
  },
  errored: {
    light: '#fce4ec',
    dark: '#e53935',
  },
  processed: {
    light: '#e8f5e9',
    dark: '#43a047',
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
