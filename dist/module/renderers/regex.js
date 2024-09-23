import { node, ComponentNode, TextNode, ElementNode } from "../node";
import { text } from "./text";
export function regex() {
  var regexRenderer = text();
  return function (nodeInstance) {
    return new RegExp(regexRenderer(nodeInstance));
  };
}
regex.node = function (el, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  var nodeInstance = node.apply(void 0, [el, props].concat(children));
  if (el.renderer) {
    return nodeInstance.render(el.renderer());
  }
  return nodeInstance;
};