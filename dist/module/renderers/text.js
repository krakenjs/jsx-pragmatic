import { ComponentNode, TextNode, ElementNode } from "../node";
import { NODE_TYPE } from "../constants";
export function text() {
  var _textRenderer = function textRenderer(node) {
    if (node.type === NODE_TYPE.COMPONENT) {
      return [].concat(node.renderComponent(_textRenderer)).join("");
    }
    if (node.type === NODE_TYPE.ELEMENT) {
      throw new Error("Text renderer does not support basic elements");
    }
    if (node.type === NODE_TYPE.TEXT) {
      return node.text;
    }
    throw new TypeError("Unhandleable node: " + node.type);
  };
  return _textRenderer;
}