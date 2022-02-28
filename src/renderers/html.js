/* @flow */
/* eslint unicorn/prefer-spread: off */

import { ComponentNode, TextNode, ElementNode, type NodePropsType, type NodeRenderer } from '../node';
import { NODE_TYPE } from '../constants';

type HTMLRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<*>, string>;

const ELEMENT_PROP = {
    INNER_HTML: 'innerHTML'
};

const SELF_CLOSING_TAGS = {
    br: true
};

function htmlEncode(text : string) : string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
}

function propsToHTML(props : NodePropsType) : string {
    const keys = Object.keys(props).filter(key => {
        const val = props[key];

        if (key === ELEMENT_PROP.INNER_HTML) {
            return false;
        }

        if (typeof val === 'string' || typeof val === 'number' || val === true) {
            return true;
        }

        return false;
    });

    if (!keys.length) {
        return '';
    }

    const pairs = keys.map(key => {
        const val = props[key];

        if (val === true) {
            return `${ htmlEncode(key) }`;
        }

        if (typeof val !== 'string' && typeof val !== 'number') {
            throw new TypeError(`Unexpected prop type: ${ typeof val }`);
        }

        if (val === '') {
            return htmlEncode(key);
        }

        return `${ htmlEncode(key) }="${ htmlEncode(val.toString()) }"`;
    });

    return ` ${ pairs.join(' ') }`;
}

export function html() : HTMLRenderer {

    const htmlRenderer = (node) => {
        if (node.type === NODE_TYPE.COMPONENT) {
            return [].concat(node.renderComponent(htmlRenderer)).join('');
        }

        if (node.type === NODE_TYPE.ELEMENT) {
            const renderedProps = propsToHTML(node.props);

            if (SELF_CLOSING_TAGS[node.name]) {
                return `<${ node.name }${ renderedProps } />`;
            } else {
                const renderedChildren = (typeof node.props[ELEMENT_PROP.INNER_HTML] === 'string')
                    ? node.props[ELEMENT_PROP.INNER_HTML]
                    : node.renderChildren(htmlRenderer).join('');

                return `<${ node.name }${ renderedProps }>${ renderedChildren }</${ node.name }>`;
            }
        }

        if (node.type === NODE_TYPE.TEXT) {
            return htmlEncode(node.text);
        }

        throw new TypeError(`Unhandleable node: ${ node.type }`);
    };

    return htmlRenderer;
}
