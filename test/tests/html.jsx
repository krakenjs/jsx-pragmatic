/* @flow */
/** @jsx node */

import { node, html } from '../../src';

describe('html renderer cases', () => {

    it('should render a basic element as html with a tag name, dynamic attribute, and inner text', () => {

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

    it('should render an advanced element as html with children', () => {

        const bar = 'baz';

        const jsxNode = (
            <section innerHTML="meepmoop">
                This is some text
                <p n={ 1 } hello={ true } />
                <button foo={ bar } baz='' zomg={ { hello: 'world' } }>click me</button>
            </section>
        );

        const htmlString = jsxNode.render(html());
        const htmlExpected = `<section>This is some text<p n="1" hello></p><button foo="baz">click me</button></section>`;

        if (htmlString !== htmlExpected) {
            throw new Error(`Expected:\n\n${ htmlExpected }\n\nActual:\n\n${ htmlString }\n`);
        }
    });
});
