module.exports = {
  extends:
    "./node_modules/@krakenjs/eslint-config-grumbler/eslintrc-typescript.js",

  globals: {
    __TEST__: true,
  },

  rules: {
    "@typescript-eslint/keyword-spacing": "off",
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
