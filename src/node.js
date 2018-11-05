/* @flow */

export type NodePropsType = { [string] : mixed };
// eslint-disable-next-line no-use-before-define
export type NodeType = ElementNode | TextNode | FragmentNode;
// eslint-disable-next-line no-use-before-define
export type NodeChildrenType = $ReadOnlyArray<ElementNode | TextNode>;
export type NodeRenderer<T> = (string, NodePropsType, NodeChildrenType) => T;
export type NodeRendererFactory<T, O = Object> = (O | void) => NodeRenderer<T>;

class Node {
    isElementNode() : boolean {
        return false;
    }

    isTextNode() : boolean {
        return false;
    }

    isFragmentNode() : boolean {
        return false;
    }
}

export class ElementNode extends Node {
    name : string
    props : NodePropsType
    children : NodeChildrenType

    constructor(name : string, props : NodePropsType, children : NodeChildrenType) {
        super();
        this.name = name;
        this.props = props;
        this.children = children;
    }

    getTag() : string {
        return this.name;
    }

    isTag(name : string) : boolean {
        return name === this.name;
    }

    isElementNode() : boolean {
        return true;
    }

    render<T>(renderer : NodeRenderer<T>) : T {
        return renderer(this.name, this.props, this.children);
    }

    getText() : string {
        throw new Error(`Can not get text of an element node`);
    }
}

export class TextNode extends Node {
    text : string

    constructor(text : string) {
        super();
        this.text = text;
    }

    getTag() : string {
        throw new Error(`Can not get tag of text node`);
    }

    isTag(name : string) : boolean { // eslint-disable-line no-unused-vars
        throw new Error(`Can not check tag of text node`);
    }

    isTextNode() : boolean {
        return true;
    }

    render<T>(renderer : NodeRenderer<T>) : T { // eslint-disable-line no-unused-vars
        throw new Error(`Can not render a text node`);
    }

    getText() : string {
        return this.text;
    }
}

export class FragmentNode extends Node {
    children : NodeChildrenType

    constructor(children : NodeChildrenType) {
        super();
        this.children = children;
    }

    getTag() : string {
        throw new Error(`Can not get tag of fragment node`);
    }

    isTag(name : string) : boolean { // eslint-disable-line no-unused-vars
        throw new Error(`Can not check tag of fragment node`);
    }

    isFragmentNode() : boolean {
        return true;
    }

    render<T>(renderer : NodeRenderer<T>) : $ReadOnlyArray<T> { // eslint-disable-line no-unused-vars
        throw new Error(`Can not render a fragment node`);
    }

    getText() : string {
        throw new Error(`Can not get text of a fragment node`);
    }
}

type JsxChildType = $ReadOnlyArray<JsxChildType> | NodeType | string;
type NullableJsxChildType = $ReadOnlyArray<NullableJsxChildType> | NodeType | string | null | void;

function normalizeChild(child : NullableJsxChildType) : NodeType | void {
    if (typeof child === 'string') {
        return new TextNode(child);

    } else if (child instanceof ElementNode || child instanceof TextNode || child instanceof FragmentNode) {
        return child;

    } else if (Array.isArray(child)) {
        return new FragmentNode(normalizeChildren(child)); // eslint-disable-line no-use-before-define

    } else if (child === null || typeof child === 'undefined') {
        return; // eslint-disable-line no-useless-return

    } else {
        throw new Error(`Child node must be string or instance of jsx-pragmatic node; got ${ typeof child }`);
    }
}

function normalizeChildren(children : $ReadOnlyArray<NullableJsxChildType>) : NodeChildrenType {
    const result = [];

    for (const child of children) {
        const normalizedChild = normalizeChild(child);

        if (!normalizedChild) {
            continue;
        }

        if (normalizedChild instanceof FragmentNode) {
            for (const subchild of normalizedChild.children) {
                result.push(subchild);
            }
        } else {
            result.push(normalizedChild);
        }
    }

    return result;
}

type JSXElementBuilder = (
    element : string,
    props : NodePropsType | null,
    ...children : $ReadOnlyArray<NullableJsxChildType>
) => ElementNode;

type JSXElementFunctionBuilder = (
    element : (NodePropsType, $ReadOnlyArray<JsxChildType>) => ElementNode,
    props : NodePropsType | null,
    ...children : $ReadOnlyArray<NullableJsxChildType>
) => ElementNode;

type JSXTextFunctionBuilder = (
    element : (NodePropsType, $ReadOnlyArray<JsxChildType>) => string | TextNode,
    props : NodePropsType | null,
    ...children : $ReadOnlyArray<NullableJsxChildType>
) => TextNode;

type JSXFragmentFunctionBuilder = (
    element : (NodePropsType, $ReadOnlyArray<JsxChildType>) => FragmentNode | $ReadOnlyArray<JsxChildType>,
    props : NodePropsType | null,
    ...children : $ReadOnlyArray<NullableJsxChildType>
) => FragmentNode;

type JSXEmptyFunctionBuilder = (
    element : (NodePropsType, $ReadOnlyArray<JsxChildType>) => null | void,
    props : NodePropsType | null,
    ...children : $ReadOnlyArray<NullableJsxChildType>
) => void;

type JSXBuilder = JSXElementBuilder & JSXElementFunctionBuilder & JSXTextFunctionBuilder & JSXFragmentFunctionBuilder & JSXEmptyFunctionBuilder;

export const node : JSXBuilder = (element, props, ...children) => {
    if (typeof element === 'string') {
        return new ElementNode(element, props || {}, normalizeChildren(children));
    }

    if (typeof element === 'function') {
        // $FlowFixMe
        return normalizeChild(element(props || {}, normalizeChildren(children)));
    }
    
    throw new TypeError(`Expected jsx Element to be a string or a function`);
};

export function Fragment(props : NodePropsType, ...children : $ReadOnlyArray<JsxChildType>) : FragmentNode {
    
    if (props && Object.keys(props).length) {
        throw new Error(`Do not pass props to Fragment`);
    }

    return new FragmentNode(normalizeChildren(children));
}
