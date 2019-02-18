/* @flow */

import type { Node } from 'react'; // eslint-disable-line import/no-unresolved

import { ComponentNode, TextNode, ElementNode, type NodeRenderer } from '../node';
import { NODE_TYPE } from '../constants';

type ReactType = {|
    createElement : Function
|};

type ReactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<*>, Node | string | null>;

export function react({ React } : { React : ReactType } = {}) : ReactRenderer {
    if (!React) {
        throw new Error(`Must pass React library to react renderer`);
    }
    
    const reactRenderer = (node) => {
        if (node.type === NODE_TYPE.COMPONENT) {
            return React.createElement(() => (node.renderComponent(reactRenderer) || null), node.props, ...node.renderChildren(reactRenderer));
        }
        
        if (node.type === NODE_TYPE.ELEMENT) {
            return React.createElement(node.name, node.props, ...node.renderChildren(reactRenderer));
        }
        
        if (node.type === NODE_TYPE.TEXT) {
            return node.text;
        }

        throw new TypeError(`Unhandleable node`);
    };

    return reactRenderer;
}
