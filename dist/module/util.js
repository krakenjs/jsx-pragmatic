var ALPHA_CHARS = '0123456789abcdef';
export function uniqueID() {
  return 'xxxxxxxxxx'.replace(/./g, function () {
    return ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length));
  });
} // eslint-disable-next-line flowtype/no-weak-types

export function isDefined(val) {
  return val !== null && typeof val !== 'undefined';
}