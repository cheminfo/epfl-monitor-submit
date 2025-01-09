export function getColorFromStatus(status) {
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
}
