/* @flow */

import type { NodePropsType, NodeRendererFactory } from '../node';

const ELEMENT_PROP = {
    INNER_HTML: 'innerHTML'
};

function htmlEncode(html : string) : string {
    return html
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

        if (!val) {
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

        return `${ htmlEncode(key) }="${ htmlEncode(val.toString()) }"`;
    });

    return ` ${ pairs.join(' ') }`;
}

export const html : NodeRendererFactory<string> = () => {

    const htmlRenderer = (name, props, children) => {

        const renderedChildren = (typeof props[ELEMENT_PROP.INNER_HTML] === 'string')
            ? props[ELEMENT_PROP.INNER_HTML]
            : children.map(child => {
                return child.isTextNode() ? htmlEncode(child.getText()) : child.render(htmlRenderer);
            }).join('');

        return `<${ name }${ propsToHTML(props) }>${ renderedChildren }</${ name }>`;
    };

    return htmlRenderer;
};
