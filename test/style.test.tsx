/** @jsx node */

/** @jsxFrag Fragment */

/* eslint max-lines: off */
import { describe, expect, it } from "vitest";

import { node, html, Style } from "../src";
describe("style cases", () => {
  it("should render a style component", () => {
    const css = `
            b {
                color: blue;
            }
        `;
    const jsxNode = (
      <Style css={css}>
        <b>Hello world</b>
      </Style>
    );
    jsxNode.render(html());
  });
});
