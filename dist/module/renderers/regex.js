import { node, ComponentNode, TextNode, ElementNode } from '../node';
import { text } from './text';
export function regex() {
  var regexRenderer = text(); // eslint-disable-next-line security/detect-non-literal-regexp

  return function (nodeInstance) {
    return new RegExp(regexRenderer(nodeInstance));
  };
} // $FlowFixMe

regex.node = function (el, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  // $FlowFixMe
  var nodeInstance = node.apply(void 0, [el, props].concat(children));

  if (el.renderer) {
    return nodeInstance.render(el.renderer());
  }

  return nodeInstance;
};