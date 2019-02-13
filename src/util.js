/* @flow */

const ALPHA_CHARS = '0123456789abcdef';

export function uniqueID() : string {
    return 'xxxxxxxxxx'.replace(/./g, () => ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length)));
}
