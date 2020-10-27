declare module 'jsx-pragmatic' {
  /* node.js */
  export type NodePropsType = {
    [key: string]: any,
  };

  export type EmptyProps = {};

  export type NodeRenderer<N, O> = (N) => O;
  export type NodeRendererFactory<L, N, O> = (L) => NodeRenderer<N, O>;

  type Primitive = string | boolean | number;
  type NullablePrimitive = Primitive | null | void;

  export type NodeType = ElementNode | TextNode | FragmentNode | ComponentNode<any>;
  export type ChildNodeType = ElementNode | TextNode | ComponentNode<any>;
  export type ChildType = ChildNodeType | Primitive | ReadonlyArray<ChildType>;
  export type ChildrenType = ReadonlyArray<ChildNodeType>;
  export type NullableChildType = ReadonlyArray<ChildType> | ChildNodeType | NullablePrimitive;
  export type NullableChildrenType = ReadonlyArray<NullableChildrenType | ChildNodeType | NullablePrimitive>;

  export type ComponentFunctionType<P> = (P, ChildrenType) => NullableChildType;

  export type CreateElementNode = <P>(element: string, props: P, ...children: Array<NullableChildrenType>) => ElementNode;
  export type CreateComponentNode = <P>(element: ComponentFunctionType<P>, props: P, ...children: Array<NullableChildrenType>) => ComponentNode<any>;
  export type CreateNullComponentNode = <P>(element: ComponentFunctionType<P>, props: null, ...children: Array<NullableChildrenType>) => ComponentNode<any>;

  export type CreateNode = CreateNullComponentNode & CreateComponentNode & CreateElementNode;

  export interface ElementNode {
    type: 'element';
    name: string;
    props: NodePropsType;
    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>;
    onRender?: <T>(T) => void;

    constructor(name: string, props: NodePropsType, children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>);

    render<T>(renderer: NodeRenderer<any, any>): T;

    renderChildren<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T>
  }

  export interface FragmentNode {
    type: 'fragment';

    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>;

    constructor(children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>);

    render<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T>;
  }

  export interface TextNode {
    type: 'text';
    text: string;

    constructor(text: string);

    render<T>(renderer: NodeRenderer<any, any>): T;
  }

  export interface ComponentNode<P = null> {
    type: 'component';
    component: ComponentFunctionType<NodePropsType>
    props: NodePropsType
    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>

    constructor(component: ComponentFunctionType<NodePropsType>, props: NodePropsType, children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>);

    renderComponent(renderer: NodeRenderer<any, any>): any;

    render<T>(renderer: NodeRenderer<any, any>): T;

    renderChildren<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T>;
  }

  export function node<P>(element, props: P, ...children): ElementNode | ComponentNode<any>;

  export function Fragment(props: null, children: ChildType): NullableChildrenType;

  /* renderers.js */

  /* renderers.js -> text.js */
  type TextRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, string>;

  export function text(): TextRenderer;

  /* renderers.js -> dom.js */
  type DomNodeRenderer = NodeRenderer<ElementNode, HTMLElement>;
  type DomTextRenderer = NodeRenderer<TextNode, Text>;
  type DomComponentRenderer = NodeRenderer<ComponentNode<any>, HTMLElement | TextNode | ReadonlyArray<HTMLElement | TextNode> | void>;
  type DomRenderer = DomComponentRenderer & DomNodeRenderer & DomTextRenderer;
  type DomOptions = {
    doc?: Document
  };

  export function dom(opts?: DomOptions): DomRenderer;

  /* renderers.js -> react.js */
  type ReactType = {
    createElement: Function
  };

  type ReactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, Node | string | null>;

  export function react({React}: { React: ReactType }): ReactRenderer;

  /* renderers.js -> html.js */
  type HTMLRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, string>;

  export function html(): HTMLRenderer;

  /* renderers.js -> preact.js */
  type PreactType = {
    h: Function
  };
  type PreactNode = {};
  type PreactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, PreactNode | string | null>;

  export function preact({Preact}: { Preact: PreactType }): PreactRenderer;

  /* renderers.js -> regex.js */
  type RegexRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, RegExp>;

  export interface regex {
    (): RegexRenderer,
    node<P>(el: string | ComponentFunctionType<P>, props: P | null, ...children: Array<any>): ElementNode | ComponentNode<any>,
  }

  /* constants.js */
  export const NODE_TYPE: {
    ELEMENT: 'element',
    TEXT: 'text',
    COMPONENT: 'component',
    FRAGMENT: 'fragment',
  };

  /* component.js -> style.jsx */
  type StyleProps = {
    css: string | { _getCss: () => string },
    nonce?: string,
    children?: NullableChildrenType,
  };

  export function Style(props: StyleProps): ChildType;

  /* component.js -> regex.jsx */
  export type RegexOptions = {
    exact?: boolean
  };

  export interface Regex {
    (options: RegexOptions, children?: ChildrenType): ChildType,
    renderer: regex,
  }

  type RegexTextOptions = {};

  export function RegexText(props: RegexTextOptions, children?: ChildrenType): ChildType;

  type RegexWordOptions = {};

  export function RegexWord(props: RegexWordOptions, children?: ChildrenType): ChildType;

  type RegexCharactersOptions = {};

  export function RegexCharacters(props: RegexCharactersOptions, children?: ChildrenType): ChildType;

  type RegexGroupOptions = {
    optional?: boolean,
    repeat?: boolean | number,
    repeatMin?: number,
    repeatMax?: number,
    capture?: boolean,
    union?: boolean,
    name?: string
  };
  export function RegexGroup(props: RegexGroupOptions, children?: ChildrenType): ChildType;

  type RegexUnionOptions = {};
  export function RegexUnion(props: RegexUnionOptions, children?: ChildrenType): ChildType;
}
