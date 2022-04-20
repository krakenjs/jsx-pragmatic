/* @flow */
/** @jsx node */

import { node, react, type ElementNode } from "../../src";

describe("react renderer cases", () => {
  it("should render a basic element as a React element with a tag name, dynamic attribute, and inner text", () => {
    const bar = "baz";

    const jsxNode = <button foo={bar}>click me</button>;

    let createElementCalled = false;

    const React = {
      createElement: (name, props, ...children) => {
        createElementCalled = true;

        if (name !== "button") {
          throw new Error(`Expected React tag name to be button, got ${name}`);
        }

        if (children[0] !== "click me") {
          throw new Error(
            `Expected React inner text to be 'click me', got '${children[0]}'`
          );
        }

        if (props.foo !== bar) {
          throw new Error(
            `Expected dom node attribute 'foo' to be '${bar}', got ${props.foo}`
          );
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalled) {
      throw new Error(`Expected React.createElement to be called`);
    }
  });

  it("should render a basic element as a React element with a class", () => {
    const bar = "baz";

    const jsxNode = <button class={bar}>click me</button>;

    let createElementCalled = false;

    const React = {
      createElement: (name, props) => {
        createElementCalled = true;

        if (props.class) {
          throw new Error(`Expected to not get class prop`);
        }

        if (props.className !== bar) {
          throw new Error(
            `Expected dom node attribute 'className' to be '${bar}', got ${props.className}`
          );
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalled) {
      throw new Error(`Expected React.createElement to be called`);
    }
  });

  it("should render a basic element as a React element with a child node", () => {
    const jsxNode = (
      <section>
        <button>click me</button>
      </section>
    );

    let createElementCalled = false;

    const React = {
      createElement: (name, props, ...children) => {
        createElementCalled = true;

        if (name !== "button" && name !== "section") {
          throw new Error(
            `Expected React tag name to be button or section, got ${name}`
          );
        }

        if (name === "section" && children.length !== 1) {
          throw new Error(`Expected a single child, got ${children.length}`);
        }

        if (name === "section" && children[0].name !== "button") {
          throw new Error(
            `Expected a child to be button, got ${children[0].name}`
          );
        }

        return { name };
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalled) {
      throw new Error(`Expected React.createElement to be called`);
    }
  });

  it("should error out if not passed React", () => {
    let error;

    try {
      react();
    } catch (err) {
      error = err;
    }

    if (!error) {
      throw new Error(`Expected error to be thrown`);
    }
  });

  it("should call onRender when the element is rendered", () => {
    let onRenderResult;

    const jsxNode = (
      <div
        onRender={(el) => {
          onRenderResult = el;
        }}
      />
    );

    const React = {
      createElement: () => {
        return {};
      },
    };

    const renderResult = jsxNode.render(react({ React }));

    if (onRenderResult !== renderResult) {
      throw new Error(`Expected onRender to be passed correct element`);
    }
  });

  it("should render a function element as a React element with a prop", () => {
    const bar = "baz";

    const MyComponent = ({ baz }): ElementNode => (
      <button foo={baz}>click me</button>
    );

    const jsxNode = <MyComponent baz={bar} />;

    let createElementCalledFunction = false;
    let createElementCalledElement = false;

    const React = {
      createElement: (el, props, ...children) => {
        if (typeof el === "function") {
          createElementCalledFunction = true;

          if (props.baz !== bar) {
            throw new Error(
              `Expected dom node attribute 'foo' to be '${bar}', got ${props.baz}`
            );
          }

          el({
            ...props,
            children,
          });
        } else if (typeof el === "string") {
          createElementCalledElement = true;

          if (el !== "button") {
            throw new Error(`Expected React tag name to be button, got ${el}`);
          }

          if (children[0] !== "click me") {
            throw new Error(
              `Expected React inner text to be 'click me', got '${children[0]}'`
            );
          }

          if (props.foo !== bar) {
            throw new Error(
              `Expected dom node attribute 'foo' to be '${bar}', got ${props.foo}`
            );
          }
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalledFunction) {
      throw new Error(
        `Expected React.createElement to be called with a function component`
      );
    }

    if (!createElementCalledElement) {
      throw new Error(
        `Expected React.createElement to be called with an element component`
      );
    }
  });

  it("should render a function element returning undefined", () => {
    const bar = "baz";

    const MyComponent = () => {
      // pass
    };

    const jsxNode = <MyComponent baz={bar} />;

    let createElementCalledFunction = false;

    const React = {
      createElement: (el, props, ...children) => {
        if (typeof el === "function") {
          createElementCalledFunction = true;

          if (children.length) {
            throw new Error(`Expected no children to be passed`);
          }

          const result = el(props);

          if (typeof result === "undefined") {
            throw new TypeError(
              `React component should never return undefined`
            );
          }

          if (result !== null) {
            throw new Error(
              `React component should always return null when blank`
            );
          }
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalledFunction) {
      throw new Error(
        `Expected React.createElement to be called with a function component`
      );
    }
  });

  it("should render a function element returning null", () => {
    const bar = "baz";

    const MyComponent = () => {
      return null;
    };

    const jsxNode = <MyComponent baz={bar} />;

    let createElementCalledFunction = false;

    const React = {
      createElement: (el, props, ...children) => {
        if (typeof el === "function") {
          createElementCalledFunction = true;

          if (children.length) {
            throw new Error(`Expected no children to be passed`);
          }

          const result = el(props);

          if (typeof result === "undefined") {
            throw new TypeError(
              `React component should never return undefined`
            );
          }

          if (result !== null) {
            throw new Error(
              `React component should always return null when blank`
            );
          }
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalledFunction) {
      throw new Error(
        `Expected React.createElement to be called with a function component`
      );
    }
  });

  it("should pass children as a prop", () => {
    const foo = "bar";
    const bar = "baz";

    const MyComponent = (props, children) => children;

    const jsxNode = (
      <MyComponent foo={foo}>
        <button bar={bar}>click me</button>
      </MyComponent>
    );

    let createElementCalledFunction = false;
    let createElementCalledElement = false;

    const renderedElement = {};

    const React = {
      createElement: (el, props, ...children) => {
        if (typeof el === "function") {
          createElementCalledFunction = true;

          if (props.foo !== foo) {
            throw new Error(
              `Expected dom node attribute 'foo' to be '${foo}', got ${props.foo}`
            );
          }

          if (
            !children.length ||
            !children[0] ||
            children[0] !== renderedElement
          ) {
            throw new Error(`Expected to have child`);
          }

          const result = el({
            ...props,
            children,
          });

          if (result !== renderedElement) {
            throw new Error(`Expected el function to return children`);
          }

          return result;
        } else if (typeof el === "string") {
          createElementCalledElement = true;

          if (el !== "button") {
            throw new Error(`Expected React tag name to be button, got ${el}`);
          }

          if (children[0] !== "click me") {
            throw new Error(
              `Expected React inner text to be 'click me', got '${children[0]}'`
            );
          }

          if (props.bar !== bar) {
            throw new Error(
              `Expected dom node attribute 'bar' to be '${bar}', got ${props.bar}`
            );
          }

          return renderedElement;
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalledFunction) {
      throw new Error(
        `Expected React.createElement to be called with a function component`
      );
    }

    if (!createElementCalledElement) {
      throw new Error(
        `Expected React.createElement to be called with an element component`
      );
    }
  });

  it("should render a basic element as a React element with innerHTML", () => {
    const html = `div: { color: red }`;

    const jsxNode = <style innerHTML={html} />;

    let createElementCalled = false;

    const React = {
      createElement: (name, props) => {
        createElementCalled = true;

        if (name !== "style") {
          throw new Error(`Expected React tag name to be style, got ${name}`);
        }

        if (
          !props.dangerouslySetInnerHTML ||
          props.dangerouslySetInnerHTML.__html !== html
        ) {
          throw new Error(
            `Expected prop props.dangerouslySetInnerHTML.__html to be '${html}', got ${JSON.stringify(
              props.dangerouslySetInnerHTML
            )}`
          );
        }

        if (props.innerHTML) {
          throw new Error(`Expected innerHTML to not be passed`);
        }
      },
    };

    jsxNode.render(react({ React }));

    if (!createElementCalled) {
      throw new Error(`Expected React.createElement to be called`);
    }
  });
});
