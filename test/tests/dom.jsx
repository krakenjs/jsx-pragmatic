/* @flow */
/** @jsx node */
/** @jsxFrag Fragment */
/* eslint max-lines: off */

import { node, dom, Fragment } from '../../src';  // eslint-disable-line no-unused-vars

type ExpectedNode = {|
    name? : string,
    attrs? : { [string] : string },
    text? : string,
    children? : $ReadOnlyArray<ExpectedNode>
|};

function validateDOM(domNode : HTMLElement | Text, expected : ExpectedNode) {
    if (domNode.constructor.name === 'HTMLUnknownElement') {
        throw new Error(`Expected dom domNode to be a valid element`);
    }
    if (expected.text && domNode.textContent !== expected.text) {
        throw new Error(`Expected dom domNode inner text to be '${ expected.text }', got ${ domNode.textContent || 'undefined' }`);
    }

    if (domNode.nodeType === Node.TEXT_NODE || domNode instanceof Text) {
        return;
    }

    if (expected.name && domNode.tagName.toLowerCase() !== expected.name) {
        throw new Error(`Expected dom domNode tag name to be ${ expected.name }, got ${ domNode.tagName.toLowerCase() }`);
    }

    const attrs = expected.attrs;
    if (attrs) {
        for (const key of Object.keys(attrs)) {
            if (domNode.getAttribute(key) !== attrs[key]) {
                throw new Error(`Expected dom domNode attribute '${ key }' to be '${ attrs[key] }', got ${ domNode.getAttribute(key) || 'undefined' }`);
            }
        }
    }

    // $FlowFixMe
    const children : $ReadOnlyArray<HTMLElement | Text> = Array.from(domNode.childNodes).filter(child => { // eslint-disable-line unicorn/prefer-spread
        return child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE;
    });

    if (expected.children) {
        if (expected.children.length !== children.length) {
            throw new Error(`Expected ${ expected.children.length } children for ${ expected.name || 'element' }, found ${ children.length.toString() }`);
        }

        for (let i = 0; i < expected.children.length; i++) {
            validateDOM(children[i], expected.children[i]);
        }

    } else if (children.length) {
        throw new Error(`Expected no children for ${ expected.name || 'element' }, found ${ children.length.toString() }`);
    }
}

describe('dom renderer cases', () => {

    it('should render a basic element as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            <button foo={ bar }>click me</button>
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });
    });

    it('should render an advanced element as a dom element ', () => {

        const bar = 'baz';

        const jsxNode = (
            <section foo={ null } bar={ undefined }>
                <p hello={ true } />
                <button foo={ bar }>click me</button>
            </section>
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:     'section',
            children: [
                {
                    name:  'p',
                    attrs: {
                        hello: ''
                    }
                },
                {
                    name:  'button',
                    attrs: {
                        foo: bar
                    },
                    children: [
                        {
                            text: 'click me'
                        }
                    ]
                }
            ]
        });
    });

    it('should render an element with an event listener', () => {

        let clicked = false;

        const jsxNode = (
            <button onClick={ () => { clicked = true; } }>click me</button>
        );

        const domNode = jsxNode.render(dom());

        domNode.click();

        if (!clicked) {
            throw new Error(`Expected button to be clicked`);
        }
    });

    it('should render an element with innerHTML', () => {

        const jsxNode = (
            <section innerHTML={ `<p id="foo">hello world</p>` } />
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:     'section',
            children: [
                {
                    name:  'p',
                    attrs: {
                        id: 'foo'
                    },
                    children: [
                        {
                            text: 'hello world'
                        }
                    ]
                }
            ]
        });
    });

    it('should render an element with innerHTML and a script tag', () => {

        window.scriptTagRun = false;
        
        const jsxNode = (
            <section innerHTML={ `<p id="foo"><script>window.scriptTagRun = true;</script></p>` } />
        );

        const domNode = jsxNode.render(dom());

        const body = document.body;

        if (!body) {
            throw new Error(`document.body not found`);
        }

        body.appendChild(domNode);

        if (!window.scriptTagRun) {
            throw new Error(`Expected script tag to run`);
        }
    });

    it('should render an element with innerHTML as a script tag', () => {

        window.scriptTagRun = false;

        const jsxNode = (
            <script innerHTML={ `window.scriptTagRun = true;` } />
        );

        const domNode = jsxNode.render(dom());

        const body = document.body;

        if (!body) {
            throw new Error(`document.body not found`);
        }

        body.appendChild(domNode);

        if (!window.scriptTagRun) {
            throw new Error(`Expected script tag to run`);
        }
    });

    it('should error when a non-string is passed as innerHTML to a script tag', () => {

        const jsxNode = (
            <script innerHTML={ 1 } />
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error when both innerHTML and children are passed to an element', () => {

        const jsxNode = (
            <div innerHTML={ 'hello' }><p /></div>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });
    
    it('should render an element with a script tag', () => {

        window.scriptTagRun = false;
        
        const jsxNode = (
            <section>
                <p id="foo">
                    <script>
                        window.scriptTagRun = true;
                    </script>
                </p>
            </section>
        );

        const domNode = jsxNode.render(dom());

        const body = document.body;

        if (!body) {
            throw new Error(`document.body not found`);
        }

        body.appendChild(domNode);

        if (!window.scriptTagRun) {
            throw new Error(`Expected script tag to run`);
        }
    });

    it('should render an element with multiple script tags', () => {

        window.scriptTagRunCount = 0;
        
        const jsxNode = (
            <section>
                <p id="foo">
                    <script>
                        window.scriptTagRunCount += 1;
                    </script>
                </p>
                <script>
                    window.scriptTagRunCount += 1;
                </script>
            </section>
        );

        const domNode = jsxNode.render(dom());

        const body = document.body;

        if (!body) {
            throw new Error(`document.body not found`);
        }

        body.appendChild(domNode);

        if (window.scriptTagRunCount !== 2) {
            throw new Error(`Expected both script tags to run`);
        }
    });

    it('should error when an element node is passed as a child to a script tag', () => {

        const jsxNode = (
            <section>
                <script>
                    <p>hello world</p>
                </script>
            </section>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error when multiple nodes are passed as a child to a script tag', () => {

        const jsxNode = (
            <section>
                <script>
                    window.foo();
                    <p>hello world</p>
                </script>
            </section>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should render an advanced element as a dom element inside an iframe', () => {

        const bar = 'baz';

        const jsxNode = (
            <iframe>
                <html>
                    <body>
                        <section foo={ null } bar={ undefined }>
                            <p hello={ true } />
                            <button foo={ bar }>click me</button>
                        </section>
                    </body>
                </html>
            </iframe>
        );

        const domNode = jsxNode.render(dom());

        // eslint-disable-next-line no-restricted-globals, promise/no-native
        const promise = new Promise((resolve, reject) => {
            domNode.addEventListener('load', () => {
                try {
                    // $FlowFixMe
                    validateDOM(domNode.contentWindow.document.documentElement, {
                        name:     'html',
                        children: [
                            {
                                name:     'body',
                                children: [
                                    {
                                        name:     'section',
                                        children: [
                                            {
                                                name:  'p',
                                                attrs: {
                                                    hello: ''
                                                }
                                            },
                                            {
                                                name:  'button',
                                                attrs: {
                                                    foo: bar
                                                },
                                                children: [
                                                    {
                                                        text: 'click me'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        });

        const body = document.body;

        if (!body) {
            throw new Error(`document.body not found`);
        }

        body.appendChild(domNode);

        return promise;
    });

    it('should error when multiple nodes are passed as a child to an iframe tag', () => {

        const jsxNode = (
            <section>
                <iframe>
                    <p>hello world</p>
                    <p>foo bar</p>
                </iframe>
            </section>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error when a text node is passed as a child to an iframe tag', () => {

        const jsxNode = (
            <section>
                <iframe>
                    hello world
                </iframe>
            </section>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error when a non-html node is passed as a child to an iframe tag', () => {

        const jsxNode = (
            <section>
                <iframe>
                    <p>what what</p>
                </iframe>
            </section>
        );

        let error;

        try {
            jsxNode.render(dom());
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should call onRender when the element is rendered', () => {

        let onRenderResult;

        const jsxNode = (
            <div onRender={ (el) => { onRenderResult = el; } } />
        );

        const renderResult = jsxNode.render(dom());

        if (onRenderResult !== renderResult) {
            throw new Error(`Expected onRender to be passed correct element`);
        }
    });

    it('should render an advanced element as a dom element with a node child', () => {

        const myNode = document.createElement('span');
        myNode.setAttribute('aaa', 'bbb');

        const bar = 'baz';

        const jsxNode = (
            <section foo={ null } bar={ undefined }>
                <p hello={ true } />
                <node el={ myNode } />
                <button foo={ bar }>click me</button>
            </section>
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:     'section',
            children: [
                {
                    name:  'p',
                    attrs: {
                        hello: ''
                    }
                },
                {
                    name:  'span',
                    attrs: {
                        'aaa': 'bbb'
                    }
                },
                {
                    name:  'button',
                    attrs: {
                        foo: bar
                    },
                    children: [
                        {
                            text: 'click me'
                        }
                    ]
                }
            ]
        });
    });

    it('should render a component element as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const MyButton = ({ foo }) => {
            return (
                <button foo={ foo }>click me</button>
            );
        };

        const bar = 'baz';

        const jsxNode = (
            <MyButton foo={ bar } />
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });
    });

    it('should render a component element with children as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const MyButton = ({ foo }, children) => {
            return (
                <button foo={ foo }>{ children}</button>
            );
        };

        const bar = 'baz';

        const jsxNode = (
            <MyButton foo={ bar }>click me</MyButton>
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });
    });

    it('should render a component element with multiple children as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const MyButton = ({ foo }, children) => {
            return (
                <button foo={ foo }>{ children}</button>
            );
        };

        const bar = 'baz';

        const jsxNode = (
            <MyButton foo={ bar }><span>please</span> click me</MyButton>
        );

        const domNode = jsxNode.render(dom());

        validateDOM(domNode, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    name:     'span',
                    children: [
                        {
                            text: 'please'
                        }
                    ]
                },
                {
                    text: ' click me'
                }
            ]
        });
    });

    it('should render a fragment as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            // $FlowFixMe
            <>
                <button foo={ bar }>click me</button>
                <span>meep</span>
                <p><div zomg="womg">way</div></p>
            </>
        );

        const [ node1, node2, node3 ] = jsxNode.render(dom());

        validateDOM(node1, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });

        validateDOM(node2, {
            name:     'span',
            children: [
                {
                    text: 'meep'
                }
            ]
        });

        validateDOM(node3, {
            name:     'p',
            children: [
                {
                    name:  'div',
                    attrs: {
                        zomg: 'womg'
                    },
                    children: [
                        {
                            text: 'way'
                        }
                    ]
                }
            ]
        });
    });

    it('should render a fragment as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            // $FlowFixMe
            <>
                <button foo={ bar }>click me</button>
                { false }
                <span>meep</span>
                { null }
                <p><div zomg="womg">way</div></p>
            </>
        );

        const [ node1, node2, node3 ] = jsxNode.render(dom());

        validateDOM(node1, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });

        validateDOM(node2, {
            name:     'span',
            children: [
                {
                    text: 'meep'
                }
            ]
        });

        validateDOM(node3, {
            name:     'p',
            children: [
                {
                    name:  'div',
                    attrs: {
                        zomg: 'womg'
                    },
                    children: [
                        {
                            text: 'way'
                        }
                    ]
                }
            ]
        });
    });

    it('should render a list as a dom element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const Foo = () => {
            return [
                <button foo={ bar }>click me</button>,
                <span>meep</span>,
                <p><div zomg="womg">way</div></p>
            ];
        };

        const jsxNode = (
            <Foo />
        );

        const [ node1, node2, node3 ] = jsxNode.render(dom());

        validateDOM(node1, {
            name:  'button',
            attrs: {
                foo: bar
            },
            children: [
                {
                    text: 'click me'
                }
            ]
        });

        validateDOM(node2, {
            name:     'span',
            children: [
                {
                    text: 'meep'
                }
            ]
        });

        validateDOM(node3, {
            name:     'p',
            children: [
                {
                    name:  'div',
                    attrs: {
                        zomg: 'womg'
                    },
                    children: [
                        {
                            text: 'way'
                        }
                    ]
                }
            ]
        });
    });

    it('should render as an svg element', () => {
        const svgProps = {
            width:   '36',
            height:  '36',
            viewBox: '0 0 36 36',
            fill:    'transparent',
            xmlns:   'http://www.w3.org/2000/svg'
        };

        const styles = `path{transition: all 0.3s;}`;

        const pathProps = {
            'stroke':           '#000000',
            'stroke-width':   '2',
            'stroke-linecap': 'round',
            'transform':        'translate(12 12)'
        };

        const forwardSlashNodeProps = {
            ...pathProps,
            d:  'M12 0L0 12',
            id: 'forwardSlash'
        };

        const backwardSlashNodeProps = {
            ...pathProps,
            d:  'M0 0L12 12',
            id: 'backwardSlash'
        };

        const SvgImage = () => {
            return (
                <svg { ...svgProps } >
                    <style>{ styles } </style>
                    <path { ...forwardSlashNodeProps }  />
                    <path { ...backwardSlashNodeProps }  />
                </svg>
            );
        };

        const jsxNode = <SvgImage />;

        const node1 = jsxNode.render(dom());

        validateDOM(node1, {
            name:     'svg',
            attrs:    { ...svgProps },
            children: [
                {
                    name:     'style',
                    children: [ { text: styles } ]
                },
                {
                    name:  'path',
                    attrs: { ...forwardSlashNodeProps }
                },
                {
                    name:  'path',
                    attrs: { ...backwardSlashNodeProps }
                }
            ]
        });
    });
});
