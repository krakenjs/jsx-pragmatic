import type { NodeRenderer } from "../node";
import { node, ComponentNode, TextNode, ElementNode } from "../node";
import { text } from "./text";
type RegexRenderer = NodeRenderer<
  ElementNode | TextNode | ComponentNode<any>,
  RegExp
>;
export function regex(): RegexRenderer {
  const regexRenderer = text();
  // eslint-disable-next-line security/detect-non-literal-regexp
  return (nodeInstance) => new RegExp(regexRenderer(nodeInstance));
}

// @ts-expect-error
regex.node = (el, props, ...children) => {
  // $FlowFixMe
  const nodeInstance = node(el, props, ...children);

  if (el.renderer) {
    return nodeInstance.render(el.renderer());
  }

  return nodeInstance;
};
