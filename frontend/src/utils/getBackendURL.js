export function getBackendURL() {
  // frontend using vite, we need to use import.meta.env to get the environment
  if (import.meta.env.DEV) {
    return 'http://localhost:50107';
  } else {
    return '';
  }
}
