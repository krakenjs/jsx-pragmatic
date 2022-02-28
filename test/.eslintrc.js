/* @flow */
/* eslint import/no-commonjs: off */

module.exports = {
    'extends': require.resolve('grumbler-scripts/config/.eslintrc-browser-test'),

    'rules': {
        'react/display-name':    'off',
        'react/button-has-type': 'off',
        'react/prop-types':      'off'
    }
};
