/* @flow */

module.exports = {
    'extends': require.resolve('grumbler-scripts/config/.eslintrc-browser'),

    'rules': {
        'react/display-name': 'off',
        'react/button-has-type': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off'
    }
};