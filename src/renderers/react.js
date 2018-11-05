/* @flow */

import type { Node } from 'react'; // eslint-disable-line import/no-unresolved

import type { NodeRendererFactory } from '../node';

export const react : NodeRendererFactory<Node> = ({ React } = {}) => {
    if (!React) {
        throw new Error(`Must pass React library to react renderer`);
    }

    const reactRenderer = (name, props, children) => {
        const renderedChildren = children.map(child => {
            return child.isTextNode() ? child.getText() : child.render(reactRenderer);
        });

        return React.createElement(name, props, ...renderedChildren);
    };

    return reactRenderer;
};
