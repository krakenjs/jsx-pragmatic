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

    it('should escape special characters', () => {
        
        const jsxNode = (
            <button foo={ `&"'$%<>` } { ...{ '$"\'': '<><>%$&' } }>${ `a&<<b>c"<d'''/` }</button>
        );

        const htmlString = jsxNode.render(html());
        const htmlExpected = `<button foo="&amp;&quot;&#39;$%&lt;&gt;" $&quot;&#39;="&lt;&gt;&lt;&gt;%$&amp;">$a&amp;&lt;&lt;b&gt;c&quot;&lt;d&#39;&#39;&#39;&#x2F;</button>`;

        if (htmlString !== htmlExpected) {
            throw new Error(`Expected:\n\n${ htmlExpected }\n\nActual:\n\n${ htmlString }\n`);
        }
    });

    it('should call onRender when the element is rendered', () => {

        let onRenderResult;

        const jsxNode = (
            <div onRender={ (el) => { onRenderResult = el; } } />
        );

        const renderResult = jsxNode.render(html());

        if (onRenderResult !== renderResult) {
            throw new Error(`Expected onRender to be passed correct element`);
        }
    });
});
