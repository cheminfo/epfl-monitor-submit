import cheminfo from 'eslint-config-cheminfo';
import globals from 'globals';

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {},
    settings: {
      'import/core-modules': ['vitest'], // in monorepo we may have to specify the vitest is installed at the root
    },
  },
];
