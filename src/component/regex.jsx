/* @flow */
/** @jsx node */

import { type ChildType, type ChildrenType, TextNode } from '../node';
import { isDefined } from '../util';
import { NODE_TYPE } from '../constants';
import { regex } from '../renderers';

const escapeRegex = (text : string) : string => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};

const validateChildren = (name : string, children : ?ChildrenType) : ChildrenType => {
    if (!children) {
        throw new Error(`Must pass children to ${ name }`);
    }

    return children;
};

const validateNoChildren = (name : string, children : ?ChildrenType) => {
    if (children && children.length) {
        throw new Error(`Must not pass children to ${ name }`);
    }
};

const validateAndEscapeChildren = (name : string, children : ?ChildrenType) : ChildrenType => {
    children = validateChildren(name, children);

    return children.map(child => {
        if (child.type === NODE_TYPE.TEXT) {
            return new TextNode(escapeRegex(child.text));
        }

        return child;
    });
};

export type RegexOptions = {|
    exact? : boolean
|};

export function Regex({ exact = true } : RegexOptions, children? : ChildrenType) : ChildType {
    children = validateAndEscapeChildren('RegexGroup', children);

    if (!exact) {
        return children;
    }

    return [
        '^',
        ...children,
        '$'
    ];
}

Regex.renderer = regex;

type RegexTextOptions = {|
    
|};

export function RegexText(props : RegexTextOptions, children? : ChildrenType) : ChildType {
    return validateAndEscapeChildren('RegexText', children);
}

type RegexWordOptions = {|
    
|};

export function RegexWord(props : RegexWordOptions, children? : ChildrenType) : ChildType {
    validateNoChildren('RegexWord', children);

    return '\\w+';
}


type RegexCharactersOptions = {|
    
|};

export function RegexCharacters(props : RegexCharactersOptions, children? : ChildrenType) : ChildType {
    return [
        '[',
        ...validateAndEscapeChildren('RegexText', children),
        ']'
    ];
}


type RegexGroupOptions = {|
    optional? : boolean,
    repeat? : boolean | number,
    repeatMin? : number,
    repeatMax? : number,
    capture? : boolean,
    union? : boolean,
    name? : string
|};

export function RegexGroup({ repeat, repeatMin, repeatMax, name, optional = false, capture = true, union = false } : RegexGroupOptions, children? : ChildrenType) : ChildType {
    children = validateAndEscapeChildren('RegexGroup', children);

    if (isDefined(repeat) && (isDefined(repeatMin) || isDefined(repeatMax))) {
        throw new Error(`repeat can not be used with repeatMin or repeatMax`);
    }

    if (name && !capture) {
        throw new Error(`Named groups must be captured`);
    }

    if (union) {
        const result = [];

        for (const child of children) {
            result.push(child);
            result.push(new TextNode('|'));
        }
    
        result.pop();
        children = result;
    }

    const result = [];

    result.push(capture ? '(' : '(?:');

    if (name) {
        result.push(`?<${ escapeRegex(name) }>`);
    }

    result.push(...children);
    result.push(')');

    if (isDefined(repeat)) {
        if (typeof repeat === 'number') {
            result.push(`{${ repeat }}`);
        } else if (repeat === true) {
            result.push(`+`);
        }
    }

    if (isDefined(repeatMin) || isDefined(repeatMax)) {
        result.push(`{${ repeatMin || '' },${ repeatMax || '' }}`);
    }

    if (optional) {
        result.push('?');
    }

    return result;
}

type RegexUnionOptions = {|

|};

export function RegexUnion(props : RegexUnionOptions, children? : ChildrenType) : ChildType {
    children = validateAndEscapeChildren('RegexGroup', children);

    const result = [];

    for (const child of children) {
        result.push(child);
        result.push('|');
    }

    result.pop();

    return result;
}
