/* @flow */
/** @jsx node */

import { node, html } from '../../src';

describe('html renderer cases', () => {

    it('should render a basic element as a htmls element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            <button foo={ bar }>click me</button>
        );

        const htmlString = jsxNode.render(html());
        const htmlExpected = `<button foo="baz">click me</button>`;

        if (htmlString !== htmlExpected) {
            throw new Error(`Expected:\n\n${ htmlExpected }\n\nActual:\n\n${ htmlString }\n`);
        }
    });
});
