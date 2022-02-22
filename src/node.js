/* @flow */

import { NODE_TYPE } from './constants';

export type NodePropsType = {
    [string] : any // eslint-disable-line flowtype/no-weak-types
};

export type EmptyProps = {||};

export type NodeRenderer<N, O> = (N) => O;
export type NodeRendererFactory<L, N, O> = (L) => NodeRenderer<N, O>;

type Primitive = string | boolean | number;
type NullablePrimitive = Primitive | null | void;

export type NodeType = ElementNode | TextNode | FragmentNode | ComponentNode<*>; // eslint-disable-line no-use-before-define
export type ChildNodeType = ElementNode | TextNode | ComponentNode<*>; // eslint-disable-line no-use-before-define
export type ChildType = ChildNodeType | Primitive | $ReadOnlyArray<ChildType>;
export type ChildrenType = $ReadOnlyArray<ChildNodeType>;
export type NullableChildType = $ReadOnlyArray<ChildType> | ChildNodeType | NullablePrimitive;
export type NullableChildrenType = $ReadOnlyArray<NullableChildrenType | ChildNodeType | NullablePrimitive>;

export type ComponentFunctionType<P> = (P, ChildrenType) => NullableChildType;

export type CreateElementNode = <P>(string, P, ...NullableChildrenType) => ElementNode; // eslint-disable-line no-undef, no-use-before-define
export type CreateComponentNode = <P>(ComponentFunctionType<P>, P, ...NullableChildrenType) => ComponentNode<*>; // eslint-disable-line no-undef, no-use-before-define
export type CreateNullComponentNode = <P>(ComponentFunctionType<P>, null, ...NullableChildrenType) => ComponentNode<*>; // eslint-disable-line no-undef, no-use-before-define

export type CreateNode = CreateNullComponentNode & CreateComponentNode & CreateElementNode;

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
    type : (typeof NODE_TYPE.ELEMENT) = NODE_TYPE.ELEMENT;

    name : string;
    props : NodePropsType;
    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>; // eslint-disable-line no-use-before-define
    onRender : ?<T>(T) => void; // eslint-disable-line no-undef

    constructor(name : string, props : NodePropsType, children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) { // eslint-disable-line no-use-before-define
        this.name = name;
        this.props = props || {};
        this.children = children;

        const onRender = this.props.onRender;
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
    type : (typeof NODE_TYPE.FRAGMENT) = NODE_TYPE.FRAGMENT;

    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>; // eslint-disable-line no-use-before-define

    constructor(children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) { // eslint-disable-line no-use-before-define
        this.children = children;
    }

    render<T>(renderer : NodeRenderer<*, *>) : $ReadOnlyArray<T> {
        return renderChildren(this.children, renderer);
    }
}

export class TextNode {
    type : (typeof NODE_TYPE.TEXT) = NODE_TYPE.TEXT;

    text : string;

    constructor(text : string) {
        this.text = text;
    }

    render<T>(renderer : NodeRenderer<*, *>) : T {
        return renderer(this);
    }
}

// eslint-disable-next-line no-unused-vars
export class ComponentNode<P = null> {
    type : (typeof NODE_TYPE.COMPONENT) = NODE_TYPE.COMPONENT;

    component : ComponentFunctionType<NodePropsType>;
    props : NodePropsType;
    // eslint-disable-next-line no-use-before-define
    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>;

    constructor(component : ComponentFunctionType<NodePropsType>, props : NodePropsType, children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<*>>) {
        this.component = component;
        this.props = props || {};
        this.children = children;

        this.props.children = children;
    }

    renderComponent(renderer : NodeRenderer<*, *>) : * {
        const child = normalizeChild(this.component(this.props, this.children)); // eslint-disable-line no-use-before-define
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
        } else if (typeof child === 'string' || typeof child === 'number') {
            result.push(new TextNode(child.toString()));
        } else if (typeof child === 'boolean') {
            continue;
        } else if (Array.isArray(child)) {
            for (const subchild of normalizeChildren(child)) {
                result.push(subchild);
            }
        } else if (child && (child.type === NODE_TYPE.ELEMENT || child.type === NODE_TYPE.TEXT || child.type === NODE_TYPE.COMPONENT)) {
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

export const node : CreateNode = <P>(element, props : P, ...children) => {
    children = normalizeChildren(children);

    if (typeof element === 'string') {
        // $FlowFixMe
        return new ElementNode(element, props, children);
    }

    if (typeof element === 'function') {
        // $FlowFixMe
        return new ComponentNode<*>(element, props, children);
    }

    throw new TypeError(`Expected jsx element to be a string or a function`);
};

export const Fragment : ComponentFunctionType<null> = (props, children) => {
    return children;
};
