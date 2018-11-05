/* @flow */
/** @jsx node */
/** @jsxFrag Fragment */

import { node, dom, Fragment, type ElementNode } from '../../src';

describe('basic node cases', () => {

    it('should return correct types for an element node', () => {
        const jsxNode = (
            <div />
        );

        if (!jsxNode.isElementNode()) {
            throw new Error(`Expected node to be element node`);
        }

        if (jsxNode.isTextNode()) {
            throw new Error(`Expected node to not be text node`);
        }

        if (jsxNode.isFragmentNode()) {
            throw new Error(`Expected node to not be fragment node`);
        }
    });

    it('should return correct types for a fragment node', () => {
        const jsxNode = (
            // $FlowFixMe
            <>
                <div />
            </>
        );

        if (jsxNode.isElementNode()) {
            throw new Error(`Expected node to not be element node`);
        }

        if (jsxNode.isTextNode()) {
            throw new Error(`Expected node to not be text node`);
        }

        if (!jsxNode.isFragmentNode()) {
            throw new Error(`Expected node to be fragment node`);
        }
    });

    it('should return correct types for a text node', () => {
        const HelloWorld = () : string => {
            return 'Hello World';
        };

        const jsxNode = (
            <HelloWorld />
        );

        if (jsxNode.isElementNode()) {
            throw new Error(`Expected node to not be element node`);
        }

        if (!jsxNode.isTextNode()) {
            throw new Error(`Expected node to be text node`);
        }

        if (jsxNode.isFragmentNode()) {
            throw new Error(`Expected node to not be fragment node`);
        }
    });

    it('should be able to get tag for element node', () => {
        const jsxNode = (
            <div />
        );

        if (jsxNode.getTag() !== 'div') {
            throw new Error(`Expected tag to be div, got ${ jsxNode.getTag() }`);
        }
    });

    it('should not be able to get tag for fragment node', () => {
        const jsxNode = (
            // $FlowFixMe
            <>
                <div />
            </>
        );

        let error;

        try {
            jsxNode.getTag();
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for fragments`);
        }
    });

    it('should not be able to get tag for text node', () => {
        const HelloWorld = () : string => {
            return 'Hello World';
        };

        const jsxNode = (
            <HelloWorld />
        );

        let error;

        try {
            jsxNode.getTag();
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for text nodess`);
        }
    });

    it('should be able to check tag for element node', () => {
        const jsxNode = (
            <div />
        );

        if (!jsxNode.isTag('div')) {
            throw new Error(`Expected tag to be div, got ${ jsxNode.getTag() }`);
        }

        if (jsxNode.isTag('span')) {
            throw new Error(`Expected tag to not be span, got ${ jsxNode.getTag() }`);
        }
    });

    it('should not be able to check tag for fragment node', () => {
        const jsxNode = (
            // $FlowFixMe
            <>
                <div />
            </>
        );

        let error;

        try {
            jsxNode.isTag('div');
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for fragments`);
        }
    });

    it('should not be able to check tag for text node', () => {
        const HelloWorld = () : string => {
            return 'Hello World';
        };

        const jsxNode = (
            <HelloWorld />
        );

        let error;

        try {
            jsxNode.isTag('div');
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for text nodess`);
        }
    });

    it('should be able to get text for text node', () => {
        const HelloWorld = () : string => {
            return 'Hello World';
        };

        const jsxNode = (
            <HelloWorld />
        );

        if (jsxNode.getText() !== 'Hello World') {
            throw new Error(`Expected node text to be 'Hello World', got '${ jsxNode.getText() }'`);
        }
    });

    it('should not be able to get text for fragment node', () => {
        const jsxNode = (
            // $FlowFixMe
            <>
                <div />
            </>
        );

        let error;

        try {
            jsxNode.getText();
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for fragments`);
        }
    });

    it('should not be able to get text for element node', () => {
        const jsxNode = (
            <div />
        );

        let error;

        try {
            jsxNode.getText();
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected getTag to throw an error for fragments`);
        }
    });
});

describe('node render cases', () => {

    it('should be able to render an element node', () => {
        const jsxNode = (
            <div foo="bar">baz</div>
        );

        jsxNode.render((name, props, children) => {
            if (name !== 'div') {
                throw new Error(`Expected name to be div, got ${ name }`);
            }

            if (!props || Object.keys(props).length !== 1) {
                throw new Error(`Expected props to have a single element`);
            }

            if (props.foo !== 'bar') {
                throw new Error(`Expected props.foo to be bar, got ${ typeof props.foo === 'string' ? props.foo : typeof props.foo }`);
            }

            if (!children || children.length !== 1) {
                throw new Error(`Expected children to have a single element`);
            }

            if (!children[0].isTextNode()) {
                throw new Error(`Expected child to be text node`);
            }

            if (children[0].getText() !== 'baz') {
                throw new Error(`Expected child text to be 'baz', got '${ children[0].getText() }'`);
            }
        });
    });

    it('should be able to render an element node with children', () => {
        const jsxNode = (
            <section>
                <p>hello</p>
                <p>world</p>
                <ul>
                    <li>foo</li>
                    <li>bar</li>
                </ul>
            </section>
        );

        jsxNode.render((name, props, children) => {
            if (children.length !== 3) {
                throw new Error(`Expected to get 3 children, got ${ children.length }`);
            }

            children.forEach(child => {
                // eslint-disable-next-line max-nested-callbacks
                child.render((name2, props2, children2) => {
                    if (name2 === 'ul') {
                        if (children2.length !== 2) {
                            throw new Error(`Expected ul to have 2 children, got ${ children2.length }`);
                        }
                    }
                });
            });
        });
    });

    it('should not be able to render fragment node', () => {
        const jsxNode = (
            // $FlowFixMe
            <>
                <div />
            </>
        );

        let error;

        try {
            jsxNode.render(() => {
                // pass
            });
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected render to throw an error for fragment nodes`);
        }
    });

    it('should not be able to render text node', () => {
        const HelloWorld = () : string => {
            return 'Hello World';
        };

        const jsxNode = (
            <HelloWorld />
        );

        let error;

        try {
            jsxNode.render(() => {
                // pass
            });
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected render to throw an error for text nodes`);
        }
    });

    it('should be able to render a function returning an element node', () => {
        
        const Button = () : ElementNode => {
            return (
                <button />
            );
        };

        const jsxNode = (
            <Button />
        );

        jsxNode.render((name) => {
            if (name !== 'button') {
                throw new Error(`Expected name to be button, got ${ name }`);
            }
        });
    });

    it('should be able to render a function returning a list of element nodes', () => {
        
        const Button = () : $ReadOnlyArray<ElementNode> => {
            return [
                <button />,
                <p />,
                <section />
            ];
        };

        const jsxNode = (
            <div>
                <Button />
            </div>
        );

        jsxNode.render((name, props, children) => {
            if (name !== 'div') {
                throw new Error(`Expected name to be div, got ${ name }`);
            }

            if (children[0].getTag() !== 'button') {
                throw new Error(`Expected first child to be button, got ${ children[0].getTag() }`);
            }

            if (children[1].getTag() !== 'p') {
                throw new Error(`Expected second child to be p, got ${ children[0].getTag() }`);
            }

            if (children[2].getTag() !== 'section') {
                throw new Error(`Expected third child to be section, got ${ children[0].getTag() }`);
            }
        });
    });

    it('should be able to render a function returning undefined', () => {
        
        const Nothing = () : void => {
            // pass
        };

        const jsxNode = (
            <div>
                <Nothing />
            </div>
        );

        jsxNode.render((name, props, children) => {
            if (name !== 'div') {
                throw new Error(`Expected name to be div, got ${ name }`);
            }

            if (children.length) {
                throw new Error(`Expected 0 children, got ${ children.length }`);
            }
        });
    });

    it('should be able to render a function returning null', () => {
        
        const Nothing = () : null => {
            return null;
        };

        const jsxNode = (
            <div>
                <Nothing />
            </div>
        );

        jsxNode.render((name, props, children) => {
            if (name !== 'div') {
                throw new Error(`Expected name to be div, got ${ name }`);
            }

            if (children.length) {
                throw new Error(`Expected 0 children, got ${ children.length }`);
            }
        });
    });

    it('should error out when a function returns an unexpected value', () => {
        
        const Bad = () => {
            return {};
        };

        let error;

        try {
            // $FlowFixMe
            const a = <Bad />; // eslint-disable-line no-unused-vars
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error out when passing props to a fragment', () => {

        let error;

        try {
            const a = <Fragment foo="bar"><div /></Fragment>; // eslint-disable-line no-unused-vars
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });

    it('should error out when trying to render an unexpected object', () => {

        const Bad = {};
        let error;

        try {
            // $FlowFixMe
            const a = <Bad />; // eslint-disable-line no-unused-vars
        } catch (err) {
            error = err;
        }

        if (!error) {
            throw new Error(`Expected error to be thrown`);
        }
    });
});
