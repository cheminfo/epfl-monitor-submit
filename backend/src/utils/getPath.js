export function getPath() {
  return process.env.DATA_PATH || new URL('/data', import.meta.url).pathname;
}
