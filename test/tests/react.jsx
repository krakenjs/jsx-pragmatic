/* @flow */
/** @jsx node */

import { node, react } from '../../src';

describe('react renderer cases', () => {

    it('should render a basic element as a React element with a tag name, dynamic attribute, and inner text', () => {

        const bar = 'baz';

        const jsxNode = (
            <button foo={ bar }>click me</button>
        );

        let createElementCalled = false;

        const React = {
            createElement: (name, props, ...children) => {
                createElementCalled = true;

                if (name !== 'button') {
                    throw new Error(`Expected React tag name to be button, got ${ name }`);
                }
        
                if (children[0] !== 'click me') {
                    throw new Error(`Expected React inner text to be 'click me', got ${ children[0] }`);
                }
        
                if (props.foo !== bar) {
                    throw new Error(`Expected dom node attribute 'foo' to be '${ bar }', got ${ props.foo }`);
                }
            }
        };

        jsxNode.render(react({ React }));

        if (!createElementCalled) {
            throw new Error(`Expected React.createElement to be called`);
        }
    });

    it('should render a basic element as a React element with a child node', () => {

        const jsxNode = (
            <section>
                <button>click me</button>
            </section>
        );

        let createElementCalled = false;

        const React = {
            createElement: (name, props, ...children) => {
                createElementCalled = true;

                if (name !== 'button' && name !== 'section') {
                    throw new Error(`Expected React tag name to be button or section, got ${ name }`);
                }

                if (name === 'section' && children.length !== 1) {
                    throw new Error(`Expected a single child, got ${ children.length }`);
                }

                if (name === 'section' && children[0].name !== 'button') {
                    throw new Error(`Expected a child to be button, got ${ children[0].name }`);
                }

                return { name };
            }
        };

        jsxNode.render(react({ React }));

        if (!createElementCalled) {
            throw new Error(`Expected React.createElement to be called`);
        }
    });

    it('should error out if not passed React', () => {

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

    it('should call onRender when the element is rendered', () => {

        let onRenderResult;

        const jsxNode = (
            <div onRender={ (el) => { onRenderResult = el; } } />
        );

        const React = {
            createElement: () => {
                return {};
            }
        };

        const renderResult = jsxNode.render(react({ React }));

        if (onRenderResult !== renderResult) {
            throw new Error(`Expected onRender to be passed correct element`);
        }
    });
});
