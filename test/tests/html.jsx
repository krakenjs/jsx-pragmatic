/* @flow */
/** @jsx node */
/** @jsxFrag Fragment */
/* eslint react/jsx-no-useless-fragment: off */

import { node, html, Fragment } from "../../src";

describe("html renderer cases", () => {
  it("should render a basic element as html with a tag name, dynamic attribute, and inner text", () => {
    const bar = "baz";

    const jsxNode = <button foo={bar}>click me</button>;

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="baz">click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render an advanced element as html with children", () => {
    const bar = "baz";

    const jsxNode = (
      <section>
        This is some text
        <p n={1} hello={true} />
        <button foo={bar} baz="" zomg={{ hello: "world" }}>
          click me
        </button>
      </section>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<section>This is some text<p n="1" hello></p><button foo="baz" baz>click me</button></section>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should escape special characters", () => {
    const jsxNode = (
      <button foo={`&"'$%<>`} {...{ "$\"'": "<><>%$&" }}>
        ${`a&<<b>c"<d'''/`}
      </button>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="&amp;&quot;&#39;$%&lt;&gt;" $&quot;&#39;="&lt;&gt;&lt;&gt;%$&amp;">$a&amp;&lt;&lt;b&gt;c&quot;&lt;d&#39;&#39;&#39;&#x2F;</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
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

    const renderResult = jsxNode.render(html());

    if (onRenderResult !== renderResult) {
      throw new Error(`Expected onRender to be passed correct element`);
    }
  });

  it("should render a basic element as html with innerHTML", () => {
    const jsxNode = (
      <section>
        <p foo="bar" innerHTML={`<span>hello world</span>`} />
      </section>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<section><p foo="bar"><span>hello world</span></p></section>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a basic component as html with a tag name, dynamic attribute, and inner text", () => {
    const MyButton = ({ foo }) => {
      return <button foo={foo}>click me</button>;
    };

    const bar = "baz";

    const jsxNode = <MyButton foo={bar} />;

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="baz">click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a basic component with children as html with a tag name, dynamic attribute, and inner text", () => {
    const MyButton = ({ foo }, children) => {
      return <button foo={foo}>{children}</button>;
    };

    const bar = "baz";

    const jsxNode = <MyButton foo={bar}>click me</MyButton>;

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="baz">click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a basic component with multiple children as html with a tag name, dynamic attribute, and inner text", () => {
    const MyButton = ({ foo }, children) => {
      return <button foo={foo}>{children}</button>;
    };

    const bar = "baz";

    const jsxNode = (
      <MyButton foo={bar}>
        <b>please</b> click me
      </MyButton>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="baz"><b>please</b> click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a fragment element as html", () => {
    const jsxNode = (
      // $FlowFixMe
      <>
        <span foo="bar">
          <p>hello</p>
        </span>
        <p>wat</p>
        <button>click me</button>
      </>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<span foo="bar"><p>hello</p></span><p>wat</p><button>click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a list element as html", () => {
    const Foo = () => {
      return [
        <span foo="bar">
          <p>hello</p>
        </span>,
        <p>wat</p>,
        <button>click me</button>,
      ];
    };

    const jsxNode = <Foo />;

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<span foo="bar"><p>hello</p></span><p>wat</p><button>click me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a fragment with a single child as html", () => {
    const jsxNode = (
      // $FlowFixMe
      <>
        <span foo="bar">
          <p>hello</p>
        </span>
      </>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<span foo="bar"><p>hello</p></span>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should render a list with a single child as html", () => {
    const Foo = () => {
      return [
        <span foo="bar">
          <p>hello</p>
        </span>,
      ];
    };

    const jsxNode = <Foo />;

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<span foo="bar"><p>hello</p></span>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });

  it("should treat <br> as a self-closing tag", () => {
    const bar = "baz";

    const jsxNode = (
      <button foo={bar}>
        click
        <br />
        me
      </button>
    );

    const htmlString = jsxNode.render(html());
    const htmlExpected = `<button foo="baz">click<br />me</button>`;

    if (htmlString !== htmlExpected) {
      throw new Error(
        `Expected:\n\n${htmlExpected}\n\nActual:\n\n${htmlString}\n`
      );
    }
  });
});
