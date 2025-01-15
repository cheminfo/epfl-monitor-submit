export function getBackendURL() {
  if (import.meta.env.DEV) {
    return 'http:/localhost:50107';
  } else {
    return '';
  }
}
