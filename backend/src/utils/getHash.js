const { subtle } = globalThis.crypto;

export async function getHash(data, options = {}) {
  const { algorithm = 'SHA-256', encoding = 'hex' } = options;

  const hashBuffer = await subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return encoding === 'hex' ? hashHex : hashArray;
}
