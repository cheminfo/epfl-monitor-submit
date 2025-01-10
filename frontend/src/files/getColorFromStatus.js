export function getColorFromStatus(status, options = {}) {
  const { light = true } = options;
  if (light) {
    switch (status) {
      case 'to_process':
        return 'lightyellow';
      case 'errored':
        return 'pink';
      case 'processed':
        return 'lightgreen';
      default:
        return 'transparent';
    }
  } else {
    switch (status) {
      case 'to_process':
        return 'yellow';
      case 'errored':
        return 'red';
      case 'processed':
        return 'green';
      default:
        return 'transparent';
    }
  }
}
