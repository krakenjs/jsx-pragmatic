/* @flow */

module.exports = {
  extends: "@krakenjs/eslint-config-grumbler/eslintrc-browser",

  rules: {
    "react/display-name": "off",
    "react/button-has-type": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
  },

  overrides: [
    {
      files: ["**/test/**/*"],
      rules: {
        "compat/compat": "off",
        "no-restricted-globals": "off",
        "promise/no-native": "off",
      },
    },
  ],
};
