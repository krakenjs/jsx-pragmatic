import type { Node } from "react";
import type { NodeRenderer, NodePropsType } from "../node";
import { ComponentNode, TextNode, ElementNode } from "../node";
import { NODE_TYPE } from "../constants";
type ReactType = {
  createElement: (...args: Array<any>) => any;
};
type ReactRenderer = NodeRenderer<
  ElementNode | TextNode | ComponentNode<any>,
  Node | string | null
>;

function mapReactProps(props: NodePropsType): NodePropsType {
  const { innerHTML, class: className, ...remainingProps } = props;
  const dangerouslySetInnerHTML = innerHTML
    ? {
        __html: innerHTML,
      }
    : null;
  // $FlowFixMe
  return {
    dangerouslySetInnerHTML,
    className,
    ...remainingProps,
  };
}

export function react({
  React,
}: {
  React: ReactType;
} = {}): ReactRenderer {
  if (!React) {
    throw new Error(`Must pass React library to react renderer`);
  }

  const reactRenderer = (node) => {
    if (node.type === NODE_TYPE.COMPONENT) {
      return React.createElement(
        () => node.renderComponent(reactRenderer) || null,
        node.props,
        ...node.renderChildren(reactRenderer)
      );
    }

    if (node.type === NODE_TYPE.ELEMENT) {
      return React.createElement(
        node.name,
        mapReactProps(node.props),
        ...node.renderChildren(reactRenderer)
      );
    }

    if (node.type === NODE_TYPE.TEXT) {
      return node.text;
    }

    throw new TypeError(`Unhandleable node`);
  };

  return reactRenderer;
}
