/* @flow */
/* eslint import/no-nodejs-modules: off, import/no-default-export: off */

import type { WebpackConfig } from "@krakenjs/webpack-config-grumbler/index.flow";
import { getWebpackConfig } from "@krakenjs/webpack-config-grumbler";

const FILE_NAME = "jsx-pragmatic";
const MODULE_NAME = "pragmatic";

export const WEBPACK_CONFIG: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
});

export const WEBPACK_CONFIG_MIN: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
  },
});

export const WEBPACK_CONFIG_TEST: WebpackConfig = getWebpackConfig({
  modulename: MODULE_NAME,
  options: {
    devtool: "inline-source-map",
  },
  vars: {
    __TEST__: true,
  },
});

export const WEBPACK_CONFIG_DEMO: WebpackConfig = getWebpackConfig({
  entry: "./demo/dev/index.jsx",
  filename: `${FILE_NAME}-demo.js`,
  modulename: MODULE_NAME,
  minify: false,
});

export default [WEBPACK_CONFIG, WEBPACK_CONFIG_MIN, WEBPACK_CONFIG_DEMO];
