/* @flow */
/** @jsx node */
/** @jsxFrag Fragment */
/* eslint max-lines: off */

import {
  node,
  Fragment,
  ElementNode,
  ComponentNode,
  TextNode,
} from "../../src";

describe("basic node cases", () => {
  it("should return correct types for an element node", () => {
    const jsxNode = <div />;

    if (!(jsxNode instanceof ElementNode)) {
      throw new TypeError(`Expected node to be element node`);
    }
  });

  it("should return correct types for a fragment node", () => {
    const jsxNode = (
      // $FlowFixMe
      <>
        <div />
        <div />
      </>
    );

    if (!(jsxNode instanceof ComponentNode)) {
      throw new TypeError(`Expected node to be component node`);
    }
  });

  it("should return correct types for a component node", () => {
    const HelloWorld = (): string => {
      return "Hello World";
    };

    const jsxNode = <HelloWorld />;

    if (!(jsxNode instanceof ComponentNode)) {
      throw new TypeError(`Expected node to be component node`);
    }
  });
});

function objectRenderer(
  renderNode: ComponentNode<*> | ElementNode | TextNode
): Object {
  if (renderNode instanceof ComponentNode) {
    return renderNode.renderComponent(objectRenderer);
  }

  if (renderNode instanceof ElementNode) {
    return {
      name: renderNode.name,
      props: renderNode.props,
      children: renderNode.renderChildren(objectRenderer),
    };
  }

  if (renderNode instanceof TextNode) {
    return {
      text: renderNode.text,
    };
  }

  throw new Error(`Can not handle node type`);
}

describe("node render cases", () => {
  it("should be able to render an element node", () => {
    const jsxNode = <div foo="bar">baz</div>;

    const { name, props, children } = jsxNode.render(objectRenderer);

    if (name !== "div") {
      throw new Error(`Expected name to be div, got ${name}`);
    }

    if (!props || Object.keys(props).length !== 1) {
      throw new Error(`Expected props to have a single element`);
    }

    if (props.foo !== "bar") {
      throw new Error(
        `Expected props.foo to be bar, got ${
          typeof props.foo === "string" ? props.foo : typeof props.foo
        }`
      );
    }

    if (!children || children.length !== 1) {
      throw new Error(`Expected children to have a single element`);
    }

    if (children[0].text !== "baz") {
      throw new Error(
        `Expected child text to be 'baz', got '${children[0].text}'`
      );
    }
  });

  it("should be able to render an element node with children", () => {
    const jsxNode = (
      <section>
        <p>hello</p>
        <p>world</p>
        <ul>
          <li>foo</li>
          <li>bar</li>
        </ul>
      </section>
    );

    const { children } = jsxNode.render(objectRenderer);

    if (children.length !== 3) {
      throw new Error(`Expected to get 3 children, got ${children.length}`);
    }

    children.forEach((innerNode) => {
      if (innerNode.name === "ul") {
        if (innerNode.children.length !== 2) {
          throw new Error(
            `Expected ul to have 2 children, got ${innerNode.children.length}`
          );
        }
      }
    });
  });

  it("should be able to render fragment node", () => {
    const jsxNode = (
      // $FlowFixMe
      <>
        <div />
        <div />
        <div />
      </>
    );

    const children = jsxNode.render(objectRenderer);

    if (children.length !== 3) {
      throw new Error(`Expected to get 3 children, got ${children.length}`);
    }
  });

  it("should be able to render a function returning an element node", () => {
    const Button = (): ElementNode => {
      return <button />;
    };

    const jsxNode = <Button />;

    const { name } = jsxNode.render(objectRenderer);

    if (name !== "button") {
      throw new Error(`Expected name to be button, got ${name}`);
    }
  });

  it("should be able to render a function returning a list of element nodes", () => {
    const Button = (): $ReadOnlyArray<ElementNode> => {
      return [<button />, <p />, <section />];
    };

    const jsxNode = (
      <div>
        <Button />
      </div>
    );

    const { name, children } = jsxNode.render(objectRenderer);

    if (name !== "div") {
      throw new Error(`Expected name to be div, got ${name}`);
    }

    if (children[0].name !== "button") {
      throw new Error(
        `Expected first child to be button, got ${children[0].name}`
      );
    }

    if (children[1].name !== "p") {
      throw new Error(`Expected second child to be p, got ${children[0].name}`);
    }

    if (children[2].name !== "section") {
      throw new Error(
        `Expected third child to be section, got ${children[0].name}`
      );
    }
  });

  it("should be able to render a function returning a fragment containing element nodes", () => {
    const Button = () => {
      return (
        <Fragment>
          <button />
          <p />
          <section />
        </Fragment>
      );
    };

    const jsxNode = (
      <div>
        <Button />
      </div>
    );

    const { name, children } = jsxNode.render(objectRenderer);

    if (name !== "div") {
      throw new Error(`Expected name to be div, got ${name}`);
    }

    if (children[0].name !== "button") {
      throw new Error(
        `Expected first child to be button, got ${children[0].name}`
      );
    }

    if (children[1].name !== "p") {
      throw new Error(`Expected second child to be p, got ${children[0].name}`);
    }

    if (children[2].name !== "section") {
      throw new Error(
        `Expected third child to be section, got ${children[0].name}`
      );
    }
  });

  it("should be able to render a function returning undefined", () => {
    const Nothing = (): void => {
      // pass
    };

    const jsxNode = (
      <div>
        <Nothing />
      </div>
    );

    const { name, children } = jsxNode.render(objectRenderer);

    if (name !== "div") {
      throw new Error(`Expected name to be div, got ${name}`);
    }

    if (children.length) {
      throw new Error(`Expected 0 children, got ${children.length}`);
    }
  });

  it("should be able to render a function returning null", () => {
    const Nothing = (): null => {
      return null;
    };

    const jsxNode = (
      <div>
        <Nothing />
      </div>
    );

    const { name, children } = jsxNode.render(objectRenderer);

    if (name !== "div") {
      throw new Error(`Expected name to be div, got ${name}`);
    }

    if (children.length) {
      throw new Error(`Expected 0 children, got ${children.length}`);
    }
  });

  it("should error out when a function returns an unexpected value", () => {
    const Bad = () => {
      return {};
    };

    let error;

    try {
      // $FlowFixMe
      (<Bad />).render();
    } catch (err) {
      error = err;
    }

    if (!error) {
      throw new Error(`Expected error to be thrown`);
    }
  });

  it("should not error out when passing props to a fragment", () => {
    const jsxNode = (
      // $FlowFixMe
      <Fragment foo="bar">
        <div />
        <div />
      </Fragment>
    );
    jsxNode.render(objectRenderer);
  });

  it("should error out when trying to render an unexpected object", () => {
    const Bad = {};
    let error;

    try {
      // $FlowFixMe
      const a = <Bad />; // eslint-disable-line no-unused-vars
    } catch (err) {
      error = err;
    }

    if (!error) {
      throw new Error(`Expected error to be thrown`);
    }
  });

  it("should call onRender when the element is rendered", () => {
    const element = {};
    let onRenderResult;

    const jsxNode = (
      <div
        onRender={(el) => {
          onRenderResult = el;
        }}
      />
    );

    const renderResult = jsxNode.render(() => {
      return element;
    });

    if (renderResult !== element) {
      throw new Error(`Expected render to return correct element`);
    }

    if (onRenderResult !== element) {
      throw new Error(`Expected onRender to be passed correct element`);
    }
  });
});
