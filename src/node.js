/* @flow */

import { NODE_TYPE } from './constants';

export type NodePropsType = {
    [string] : any // eslint-disable-line flowtype/no-weak-types
};

export type EmptyProps = {||};

export type NodeRenderer<N, O> = (N) => O;
export type NodeRendererFactory<L, N, O> = (L) => NodeRenderer<N, O>;

export type NodeType = ElementNode | TextNode | FragmentNode | ComponentNode<*>; // eslint-disable-line no-use-before-define
export type ChildNodeType = ElementNode | TextNode | ComponentNode<*>; // eslint-disable-line no-use-before-define
export type ChildType = ChildNodeType | string | $ReadOnlyArray<ChildType>;
export type ChildrenType = $ReadOnlyArray<ChildNodeType>;
export type NullableChildType = $ReadOnlyArray<ChildType> | ChildNodeType | string | null | void;
export type NullableChildrenType = $ReadOnlyArray<NullableChildrenType | ChildNodeType | string | null | void>;

export type ComponentFunctionType<P> = (P, ChildrenType) => NullableChildType;

export type CreateElementNode<P : NodePropsType> = (string, P | null, ...NullableChildrenType) => ElementNode; // eslint-disable-line no-use-before-define
export type CreateComponentNode<P : NodePropsType> = (ComponentFunctionType<P>, P | null, ...NullableChildrenType) => ComponentNode<P>; // eslint-disable-line no-use-before-define
export type CreateNode<P : NodePropsType> = CreateElementNode<P> & CreateComponentNode<P>;

function renderChildren<T>(children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>, renderer : NodeRenderer<*, *>) : $ReadOnlyArray<T> { // eslint-disable-line no-use-before-define
    const result = [];

    for (const child of children) {
        const renderedChild = child.render(renderer);

        if (!renderedChild) {
            continue;
        } else if (Array.isArray(renderedChild)) {
            for (const subchild of renderedChild) {
                if (subchild) {
                    result.push(subchild);
                }
            }
        } else {
            result.push(renderedChild);
        }
    }

    return result;
}

export class ElementNode {
    type : (typeof NODE_TYPE.ELEMENT) = NODE_TYPE.ELEMENT

    name : string
    props : NodePropsType
    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>> // eslint-disable-line no-use-before-define
    onRender : ?<T>(T) => void // eslint-disable-line no-undef

    constructor(name : string, props : NodePropsType, children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) { // eslint-disable-line no-use-before-define
        this.name = name;
        this.props = props;
        this.children = children;

        const onRender = props.onRender;
        if (typeof onRender === 'function') {
            this.onRender = onRender;
            delete props.onRender;
        }
    }

    render<T>(renderer : NodeRenderer<*, *>) : T {
        const el = renderer(this);
        if (this.onRender) {
            this.onRender(el);
        }
        return el;
    }

    renderChildren<T>(renderer : NodeRenderer<*, *>) : $ReadOnlyArray<T> {
        return renderChildren(this.children, renderer);
    }
}

export class FragmentNode {
    type : (typeof NODE_TYPE.FRAGMENT) = NODE_TYPE.FRAGMENT

    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>> // eslint-disable-line no-use-before-define

    constructor(children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) { // eslint-disable-line no-use-before-define
        this.children = children;
    }

    render<T>(renderer : NodeRenderer<*, *>) : $ReadOnlyArray<T> {
        return this.children.map(renderer);
    }
}

export class TextNode {
    type : (typeof NODE_TYPE.TEXT) = NODE_TYPE.TEXT

    text : string

    constructor(text : string) {
        this.text = text;
    }

    render<T>(renderer : NodeRenderer<*, *>) : T {
        return renderer(this);
    }
}

export class ComponentNode<P : NodePropsType> {
    type : (typeof NODE_TYPE.COMPONENT) = NODE_TYPE.COMPONENT

    component : ComponentFunctionType<P>
    props : NodePropsType
    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>

    constructor(component : ComponentFunctionType<P>, props : NodePropsType, children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) {
        this.component = component;
        this.props = props;
        this.children = children;
    }

    renderComponent(renderer : NodeRenderer<*, *>) : * {
        // $FlowFixMe
        const props : P = this.props;
        const child = normalizeChild(this.component(props, this.children)); // eslint-disable-line no-use-before-define
        if (child) {
            return child.render(renderer);
        }
    }

    render<T>(renderer : NodeRenderer<*, *>) : T {
        return renderer(this);
    }

    renderChildren<T>(renderer : NodeRenderer<*, *>) : $ReadOnlyArray<T> {
        return renderChildren(this.children, renderer);
    }
}

function normalizeChildren(children : NullableChildrenType) : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>> {
    const result = [];

    for (const child of children) {
        if (!child) {
            continue;
        } else if (typeof child === 'string') {
            result.push(new TextNode(child));
        } else if (Array.isArray(child)) {
            for (const subchild of normalizeChildren(child)) {
                result.push(subchild);
            }
        } else if (child instanceof ElementNode || child instanceof TextNode || child instanceof ComponentNode) {
            result.push(child);
    
        } else {
            throw new TypeError(`Unrecognized node type: ${ typeof child }`);
        }
    }

    return result;
}

function normalizeChild(child) : ElementNode | TextNode | ComponentNode<*> | FragmentNode | void {
    const children = normalizeChildren(Array.isArray(child) ? child : [ child ]);

    if (children.length === 1) {
        return children[0];
    } else if (children.length > 1) {
        return new FragmentNode(children);
    }
}

export const node : CreateNode<*> = (element, props, ...children) => {
    // $FlowFixMe
    props = props || {};
    children = normalizeChildren(children);

    if (typeof element === 'string') {
        return new ElementNode(element, props, children);
    }
    
    if (typeof element === 'function') {
        return new ComponentNode(element, props, children);
    }

    throw new TypeError(`Expected jsx element to be a string or a function`);
};

export const Fragment : ComponentFunctionType<EmptyProps> = (props : NodePropsType, children : ChildrenType) : NullableChildType => {
    if (props && Object.keys(props).length) {
        throw new Error(`Do not pass props to Fragment`);
    }

    return children;
};
