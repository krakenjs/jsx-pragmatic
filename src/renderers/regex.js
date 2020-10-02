/* @flow */

import { node, ComponentNode, TextNode, ElementNode, type NodeRenderer } from '../node';

import { text } from './text';

type RegexRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<*>, RegExp>;

export function regex() : RegexRenderer {
    const regexRenderer = text();

    // eslint-disable-next-line security/detect-non-literal-regexp
    return (nodeInstance) => new RegExp(regexRenderer(nodeInstance));
}

// $FlowFixMe
regex.node = (el, props, ...children) => {
    // $FlowFixMe
    const nodeInstance = node(el, props, ...children);

    if (el.renderer) {
        return nodeInstance.render(el.renderer());
    }

    return nodeInstance;
};
