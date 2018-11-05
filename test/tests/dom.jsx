/* @flow */
/** @jsx node */

import { node, dom } from '../../src';

describe('dom renderer cases', () => {

    it('should render a basic element as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            <button foo={ bar }>click me</button>
        );

        const domNode = jsxNode.render(dom());

        if (domNode.tagName.toLowerCase() !== 'button') {
            throw new Error(`Expected dom node tag name to be button, got ${ domNode.tagName.toLowerCase() }`);
        }

        if (domNode.innerText !== 'click me') {
            throw new Error(`Expected dom node inner text to be 'click me', got ${ domNode.innerText || 'undefined' }`);
        }

        if (domNode.getAttribute('foo') !== bar) {
            throw new Error(`Expected dom node attribute 'foo' to be '${ bar }', got ${ domNode.getAttribute('foo') || 'undefined' }`);
        }
    });
});
