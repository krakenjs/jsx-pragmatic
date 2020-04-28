/** @jsx node */
import { Fragment, node } from './node';
export function Style(_ref, children) {
  var css = _ref.css;
  return node(Fragment, null, node("style", {
    innerHTML: typeof css === 'string' ? css : css._getCss()
  }), children);
}