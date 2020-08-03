/* @flow */

import { ComponentNode, TextNode, ElementNode, type NodeRenderer, type NodePropsType } from '../node';
import { NODE_TYPE } from '../constants';

type PreactType = {|
    h : Function
|};

type PreactNode = {||};

type PreactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<*>, PreactNode | string | null>;

function mapPreactProps(props : NodePropsType) : NodePropsType {
    const { innerHTML, ...remainingProps } = props;

    const dangerouslySetInnerHTML = innerHTML
        ? { __html: innerHTML }
        : null;

    // $FlowFixMe
    return {
        dangerouslySetInnerHTML,
        ...remainingProps
    };
}

export function preact({ Preact } : {| Preact : PreactType |} = {}) : PreactRenderer {
    if (!Preact) {
        throw new Error(`Must pass Preact library to react renderer`);
    }
    
    const reactRenderer = (node) => {
        if (node.type === NODE_TYPE.COMPONENT) {
            return Preact.h(() => (node.renderComponent(reactRenderer) || null), node.props, ...node.renderChildren(reactRenderer));
        }
        
        if (node.type === NODE_TYPE.ELEMENT) {
            return Preact.h(node.name, mapPreactProps(node.props), ...node.renderChildren(reactRenderer));
        }
        
        if (node.type === NODE_TYPE.TEXT) {
            return node.text;
        }

        throw new TypeError(`Unhandleable node`);
    };

    return reactRenderer;
}
