/** @jsx node */
import { Fragment, node } from '../node';
export function Style(_ref) {
  var css = _ref.css,
      nonce = _ref.nonce,
      children = _ref.children;
  return node(Fragment, null, node("style", {
    innerHTML: typeof css === 'string' ? css : css._getCss(),
    nonce: nonce
  }), children);
}