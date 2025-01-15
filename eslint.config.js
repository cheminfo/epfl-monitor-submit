import { config } from 'eslint-config-zakodium';
import js from 'eslint-config-zakodium/js';
import jsdoc from 'eslint-config-zakodium/jsdoc';
import react from 'eslint-config-zakodium/react';
import unicorn from 'eslint-config-zakodium/unicorn';
import globals from 'globals';

export default config(
  ...js,
  ...jsdoc,
  ...unicorn,
  {
    // Global ignore patterns.
    ignores: ['**/dist'],
  },
  // Apply TypeScript config on the whole project.
  {
    // Apply Adonis v5 config only to the api.
    files: ['api/**'],
  },
  {
    // Apply React config only to the frontend.
    files: ['backend/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Apply React config only to the frontend.
    files: ['frontend/**'],
    extends: [...react],
  },
);
