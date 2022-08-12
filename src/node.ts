/* eslint no-use-before-define: off, no-undef: off*/
// Need to update to babel-eslint that is aware of flow generics
import { NODE_TYPE } from "./constants";
export type NodePropsType = Record<string, any>;
export type EmptyProps = {};
export type NodeRenderer<N, O> = (arg0: N) => O;
export type NodeRendererFactory<L, N, O> = (arg0: L) => NodeRenderer<N, O>;
type Primitive = string | boolean | number;
type NullablePrimitive = Primitive | null | void;
export type NodeType =
  | ElementNode
  | TextNode
  | FragmentNode
  | ComponentNode<any>;
export type ChildNodeType = ElementNode | TextNode | ComponentNode<any>;
export type ChildType = ChildNodeType | Primitive | ReadonlyArray<ChildType>;
export type ChildrenType = ReadonlyArray<ChildNodeType>;
export type NullableChildType =
  | ReadonlyArray<ChildType>
  | ChildNodeType
  | NullablePrimitive;
export type NullableChildrenType = ReadonlyArray<
  NullableChildrenType | ChildNodeType | NullablePrimitive
>;
export type ComponentFunctionType<P> = (
  arg0: P,
  arg1: ChildrenType
) => NullableChildType;
export type CreateElementNode = <P>(
  arg0: string,
  arg1: P,
  ...rest: NullableChildrenType
) => ElementNode;
export type CreateComponentNode = <P>(
  arg0: ComponentFunctionType<P>,
  arg1: P,
  ...rest: NullableChildrenType
) => ComponentNode<any>;
export type CreateNullComponentNode = <P>(
  arg0: ComponentFunctionType<P>,
  arg1: null,
  ...rest: NullableChildrenType
) => ComponentNode<any>;
export type CreateNode = CreateNullComponentNode &
  CreateComponentNode &
  CreateElementNode;

function renderChildren<T>(
  children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>,
  renderer: NodeRenderer<any, any>
): ReadonlyArray<T> {
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
  type: typeof NODE_TYPE.ELEMENT = NODE_TYPE.ELEMENT;
  name: string;
  props: NodePropsType;
  children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>;
  onRender: (<T>(arg0: T) => void) | null | undefined;

  constructor(
    name: string,
    props: NodePropsType,
    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>
  ) {
    this.name = name;
    this.props = props || {};
    this.children = children;
    const onRender = this.props.onRender;

    if (typeof onRender === "function") {
      this.onRender = onRender;
      delete props.onRender;
    }
  }

  render<T>(renderer: NodeRenderer<any, any>): T {
    const el = renderer(this);

    if (this.onRender) {
      this.onRender(el);
    }

    return el;
  }

  renderChildren<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T> {
    return renderChildren(this.children, renderer);
  }
}
export class FragmentNode {
  type: typeof NODE_TYPE.FRAGMENT = NODE_TYPE.FRAGMENT;
  children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>;

  constructor(
    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>
  ) {
    this.children = children;
  }

  render<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T> {
    return renderChildren(this.children, renderer);
  }
}
export class TextNode {
  type: typeof NODE_TYPE.TEXT = NODE_TYPE.TEXT;
  text: string;

  constructor(text: string) {
    this.text = text;
  }

  render<T>(renderer: NodeRenderer<any, any>): T {
    return renderer(this);
  }
}
// eslint-disable-next-line no-unused-vars
export class ComponentNode<P = null> {
  type: typeof NODE_TYPE.COMPONENT = NODE_TYPE.COMPONENT;
  component: ComponentFunctionType<NodePropsType>;
  props: NodePropsType;
  children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>;

  constructor(
    component: ComponentFunctionType<NodePropsType>,
    props: NodePropsType,
    children: ReadonlyArray<ElementNode | TextNode | ComponentNode<any>>
  ) {
    this.component = component;
    this.props = props || {};
    this.children = children;
    this.props.children = children;
  }

  renderComponent(renderer: NodeRenderer<any, any>): any {
    const child = normalizeChild(this.component(this.props, this.children));

    if (child) {
      return child.render(renderer);
    }
  }

  render<T>(renderer: NodeRenderer<any, any>): T {
    return renderer(this);
  }

  renderChildren<T>(renderer: NodeRenderer<any, any>): ReadonlyArray<T> {
    return renderChildren(this.children, renderer);
  }
}

function normalizeChildren(
  children: NullableChildrenType
): ReadonlyArray<ElementNode | TextNode | ComponentNode<any>> {
  const result = [];

  for (const child of children) {
    if (!child) {
      continue;
    } else if (typeof child === "string" || typeof child === "number") {
      result.push(new TextNode(child.toString()));
    } else if (typeof child === "boolean") {
      continue;
    } else if (Array.isArray(child)) {
      for (const subchild of normalizeChildren(child)) {
        result.push(subchild);
      }
    } else if (
      child &&
      (child.type === NODE_TYPE.ELEMENT ||
        child.type === NODE_TYPE.TEXT ||
        child.type === NODE_TYPE.COMPONENT)
    ) {
      result.push(child);
    } else {
      throw new TypeError(`Unrecognized node type: ${typeof child}`);
    }
  }

  return result;
}

function normalizeChild(
  child
): ElementNode | TextNode | ComponentNode<any> | FragmentNode | void {
  const children = normalizeChildren(Array.isArray(child) ? child : [child]);

  if (children.length === 1) {
    return children[0];
  } else if (children.length > 1) {
    return new FragmentNode(children);
  }
}

export const node: CreateNode = <P>(element, props: P, ...children) => {
  children = normalizeChildren(children);

  if (typeof element === "string") {
    // $FlowFixMe
    return new ElementNode(element, props, children);
  }

  if (typeof element === "function") {
    // $FlowFixMe
    return new ComponentNode<any>(element, props, children);
  }

  throw new TypeError(`Expected jsx element to be a string or a function`);
};
export const Fragment: ComponentFunctionType<null> = (props, children) => {
  return children;
};
