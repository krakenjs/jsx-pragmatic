declare module 'jsx-pragmatic' {
  type $ReadOnlyArray<T> = Readonly<Array<T>>;

  /* node.js */
  export type NodePropsType = {
    [key: string] : any,
  };

  export type EmptyProps = {};

  export type NodeRenderer<N, O> = (N) => O;
  export type NodeRendererFactory<L, N, O> = (L) => NodeRenderer<N, O>;

  type Primitive = string | boolean | number;
  type NullablePrimitive = Primitive | null | void;

  export type NodeType = ElementNode | TextNode | FragmentNode | ComponentNode<any>;
  export type ChildNodeType = ElementNode | TextNode | ComponentNode<any>;
  export type ChildType = ChildNodeType | Primitive | $ReadOnlyArray<ChildType>;
  export type ChildrenType = $ReadOnlyArray<ChildNodeType>;
  export type NullableChildType = $ReadOnlyArray<ChildType> | ChildNodeType | NullablePrimitive;
  export type NullableChildrenType = $ReadOnlyArray<NullableChildrenType | ChildNodeType | NullablePrimitive>;

  export type ComponentFunctionType<P> = (P, ChildrenType) => NullableChildType;

  export type CreateElementNode = <P>(element: string, props: P, ...children: Array<NullableChildrenType>) => ElementNode;
  export type CreateComponentNode = <P>(element: ComponentFunctionType<P>, props: P, ...children: Array<NullableChildrenType>) => ComponentNode<any>;
  export type CreateNullComponentNode = <P>(element: ComponentFunctionType<P>, props: null, ...children: Array<NullableChildrenType>) => ComponentNode<any>;

  export type CreateNode = CreateNullComponentNode & CreateComponentNode & CreateElementNode;

  export interface ElementNode {
    type: 'element';
    name: string;
    props: NodePropsType;
    children: $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>;
    onRender?: <T>(T) => void;

    constructor(name: string, props: NodePropsType, children: $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>);
    render<T>(renderer: NodeRenderer<any, any>): T;
    renderChildren<T>(renderer: NodeRenderer<any, any>) : $ReadOnlyArray<T>
  }

  export interface FragmentNode {
    type: 'fragment';

    children: $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>;
    constructor(children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>);
    render<T>(renderer : NodeRenderer<any, any>): $ReadOnlyArray<T>;
  }

  export interface TextNode {
    type: 'text';
    text : string;

    constructor(text : string);

    render<T>(renderer : NodeRenderer<any, any>): T;
  }

  export interface ComponentNode<P = null> {
    type: 'component';
    component : ComponentFunctionType<NodePropsType>
    props : NodePropsType
    children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>

    constructor(component: ComponentFunctionType<NodePropsType>, props : NodePropsType, children : $ReadOnlyArray<ElementNode | TextNode | ComponentNode<any>>);
    renderComponent(renderer : NodeRenderer<any, any>): any;
    render<T>(renderer : NodeRenderer<any, any>): T;

    renderChildren<T>(renderer : NodeRenderer<any, any>): $ReadOnlyArray<T>;
  }

  export function node<P>(element, props: P, ...children): ElementNode | ComponentNode<any>;
  export function Fragment(props: null, children: ChildType): NullableChildrenType;

  /* renderers.js */

  /* renderers.js -> text.js */
  type TextRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, string>;
  export function text() : TextRenderer;

  /* renderers.js -> dom.js */
  type DomNodeRenderer = NodeRenderer<ElementNode, HTMLElement>;
  type DomTextRenderer = NodeRenderer<TextNode, Text>;
  type DomComponentRenderer = NodeRenderer<ComponentNode<any>, HTMLElement | TextNode | $ReadOnlyArray<HTMLElement | TextNode> | void>;
  type DomRenderer = DomComponentRenderer & DomNodeRenderer & DomTextRenderer;
  type DomOptions = {
    doc? : Document
  };

  export function dom(opts?: DomOptions): DomRenderer;

  /* renderers.js -> react.js */
  type ReactType = {
    createElement : Function
  };

  type ReactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, Node | string | null>;
  export function react({ React }: { React: ReactType }): ReactRenderer;

  /* renderers.js -> html.js */
  type HTMLRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, string>;
  export function html(): HTMLRenderer;

  /* renderers.js -> preact.js */
  type PreactType = {
    h : Function
  };
  type PreactNode = {};
  type PreactRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, PreactNode | string | null>;

  export function preact({ Preact }: { Preact: PreactType }): PreactRenderer;

  /* renderers.js -> preact.js */
  type RegexRenderer = NodeRenderer<ElementNode | TextNode | ComponentNode<any>, RegExp>;

  export function regex(): RegexRenderer;

  // TODO: how to type regex.node()?
}
