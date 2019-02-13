/* @flow */

import type { NodeChildrenType, NodePropsType, NodeRendererFactory, NodeRenderer } from '../node';
import { uniqueID } from '../util';

const ELEMENT_TAG = {
    HTML:    'html',
    IFRAME:  'iframe',
    SCRIPT:  'script',
    NODE:    'node',
    DEFAULT: 'default'
};

const ELEMENT_PROP = {
    ID:         'id',
    INNER_HTML: 'innerHTML',
    EL:         'el'
};

function fixScripts(el : HTMLElement, doc : Document = window.document) {
    for (const script of el.querySelectorAll('script')) {
        const parentNode = script.parentNode;

        if (!parentNode) {
            continue;
        }

        const newScript = doc.createElement('script');
        // $FlowFixMe
        newScript.text = script.textContent;
        parentNode.replaceChild(newScript, script);
    }
}

type CreateElementOptions = {|
    doc : Document,
    name : string,
    props : NodePropsType
|};

const CREATE_ELEMENT : { [string] : (CreateElementOptions) => HTMLElement } = {

    [ ELEMENT_TAG.NODE ]: ({ props } : CreateElementOptions) => {
        if (!props[ELEMENT_PROP.EL]) {
            throw new Error(`Must pass ${ ELEMENT_PROP.EL } prop to ${ ELEMENT_TAG.NODE } element`);
        }

        if (Object.keys(props).length > 1) {
            throw new Error(`Must not pass any prop other than ${ ELEMENT_PROP.EL } to ${ ELEMENT_TAG.NODE } element`);
        }

        // $FlowFixMe
        return props[ELEMENT_PROP.EL];
    },

    [ ELEMENT_TAG.DEFAULT ]: ({ name, doc } : CreateElementOptions) => {
        return doc.createElement(name);
    }
};

function createElement({ doc, name, props } : CreateElementOptions) : HTMLElement {
    const elementCreator = CREATE_ELEMENT[name] || CREATE_ELEMENT[ELEMENT_TAG.DEFAULT];
    return elementCreator({ name, props, doc });
}

type AddPropsOptions = {|
    el : HTMLElement,
    props : NodePropsType
|};

function addProps({ el, props } : AddPropsOptions) {
    for (const prop of Object.keys(props)) {
        const val = props[prop];

        if (val === null || typeof val === 'undefined' || prop === ELEMENT_PROP.EL || prop === ELEMENT_PROP.INNER_HTML) {
            continue;
        }

        if (prop.match(/^on[A-Z][a-z]/) && typeof val === 'function') {
            el.addEventListener(prop.slice(2).toLowerCase(), val);
        } else if (typeof val === 'string' || typeof val === 'number') {
            el.setAttribute(prop, val.toString());

        } else if (typeof val === 'boolean') {
            if (val === true) {
                el.setAttribute(prop, '');
            }

        } else {
            throw new TypeError(`Can not render prop ${ prop } of type ${ typeof val }`);
        }
    }

    if (el.tagName.toLowerCase() === ELEMENT_TAG.IFRAME && !props.id) {
        el.setAttribute(ELEMENT_PROP.ID, `jsx-iframe-${ uniqueID() }`);
    }
}

type AddChildrenOptions = {|
    el : HTMLElement,
    name : string,
    children : NodeChildrenType,
    doc : Document,
    props : NodePropsType,
    domRenderer : NodeRenderer<HTMLElement>
|};

const ADD_CHILDREN : { [string] : (AddChildrenOptions) => void } = {

    [ ELEMENT_TAG.IFRAME ]: ({ el, children } : AddChildrenOptions) => {
        const firstChild = children[0];

        if (children.length > 1 || !firstChild.isElementNode()) {
            throw new Error(`Expected only single element node as child of ${ ELEMENT_TAG.IFRAME } element`);
        }

        if (!firstChild.isTag(ELEMENT_TAG.HTML)) {
            throw new Error(`Expected element to be inserted into frame to be html, got ${ firstChild.getTag() }`);
        }
    
        el.addEventListener('load', () => {

            // $FlowFixMe
            const win = el.contentWindow;
    
            if (!win) {
                throw new Error(`Expected frame to have contentWindow`);
            }

            const doc = win.document;
            const docElement = doc.documentElement;

            while (docElement.children && docElement.children.length) {
                docElement.removeChild(docElement.children[0]);
            }

            // eslint-disable-next-line no-use-before-define
            const child = firstChild.render(dom({ doc }));
        
            while (child.children.length) {
                docElement.appendChild(child.children[0]);
            }
        });
    },

    [ ELEMENT_TAG.SCRIPT ]: ({ el, children } : AddChildrenOptions) => {
        const firstChild = children[0];

        if (children.length !== 1 || !firstChild.isTextNode()) {
            throw new Error(`Expected only single text node as child of ${ ELEMENT_TAG.SCRIPT } element`);
        }
        
        // $FlowFixMe
        el.text = firstChild.getText();
    },

    [ ELEMENT_TAG.DEFAULT ]: ({ el, children, doc, domRenderer } : AddChildrenOptions) => {
        for (const child of children) {
            if (child.isTextNode()) {
                el.appendChild(doc.createTextNode(child.getText()));
            } else {
                el.appendChild(child.render(domRenderer));
            }
        }
    }
};

function addChildren({ el, name, props, children, doc, domRenderer } : AddChildrenOptions) {
    if (props.hasOwnProperty(ELEMENT_PROP.INNER_HTML)) {

        if (children.length >= 1) {
            throw new Error(`Expected no children to be passed when ${ ELEMENT_PROP.INNER_HTML } prop is set`);
        }

        const html = props[ELEMENT_PROP.INNER_HTML];

        if (typeof html !== 'string') {
            throw new TypeError(`${ ELEMENT_PROP.INNER_HTML } prop must be string`);
        }

        if (name === ELEMENT_TAG.SCRIPT) {
            // $FlowFixMe
            el.text = html;
        } else {
            el.innerHTML = html;
            fixScripts(el, doc);
        }

    } else {
        const addChildrenToElement = ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG.DEFAULT];
        addChildrenToElement({ el, name, props, children, doc, domRenderer });
    }
}


export const dom : NodeRendererFactory<HTMLElement> = ({ doc = document } : { doc? : Document } = {}) => {
    const domRenderer = (name, props, children) => {
        const el = createElement({ name, props, doc });
        addProps({ el, props });
        addChildren({ el, name, props, children, doc, domRenderer });
        return el;
    };

    return domRenderer;
};
