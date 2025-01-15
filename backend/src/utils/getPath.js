export function getPath() {
  return (
    import.meta.env.DATA_PATH || new URL('/data', import.meta.url).pathname
  );
}
