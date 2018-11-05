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
});
