/** @jsx node */
import { node } from './node';
export function Style(_ref) {
  var css = _ref.css;
  return node("style", {
    innerHTML: typeof css === 'string' ? css : css._getCss()
  });
}