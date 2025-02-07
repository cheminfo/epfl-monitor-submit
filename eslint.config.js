import { config, globals } from 'eslint-config-zakodium';
import js from 'eslint-config-zakodium/js';
import jsdoc from 'eslint-config-zakodium/jsdoc';
import react from 'eslint-config-zakodium/react';
import unicorn from 'eslint-config-zakodium/unicorn';

export default config(
  ...js,
  ...jsdoc,
  ...unicorn,
  {
    // Global ignore patterns.
    ignores: ['**/dist'],
  },
  {
    files: ['backend/**'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    // Apply React config only to the frontend.
    files: ['frontend/**'],
    extends: [...react],
  },
);
