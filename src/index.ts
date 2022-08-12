/* @flow */

export * from "./node";
export * from "./renderers";
export * from "./constants";
export * from "./component";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}
