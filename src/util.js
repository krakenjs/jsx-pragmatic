/* @flow */

const ALPHA_CHARS = '0123456789abcdef';

export function uniqueID() : string {
    return 'xxxxxxxxxx'.replace(/./g, () => ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length)));
}

// eslint-disable-next-line flowtype/no-weak-types
export function isDefined(val : any) : boolean %checks {
    return (val !== null && typeof val !== 'undefined');
}
