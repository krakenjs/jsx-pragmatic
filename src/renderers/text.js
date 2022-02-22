/* @flow */
/* eslint unicorn/prefer-spread: off */

import { ComponentNode, TextNode, ElementNode, type NodeRenderer } from '../node';
import { NODE_TYPE } from '../constants';

type TextRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<*>, string>;

export function text() : TextRenderer {

    const textRenderer = (node) => {
        if (node.type === NODE_TYPE.COMPONENT) {
            return [].concat(node.renderComponent(textRenderer)).join('');
        }

        if (node.type === NODE_TYPE.ELEMENT) {
            throw new Error(`Text renderer does not support basic elements`);
        }

        if (node.type === NODE_TYPE.TEXT) {
            return node.text;
        }

        throw new TypeError(`Unhandleable node: ${ node.type }`);
    };

    return textRenderer;
}
