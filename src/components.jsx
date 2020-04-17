/* @flow */
/** @jsx node */

import { node, type ChildType } from './node';

type StyleProps = {|
    css : string | {| _getCss : () => string |}
|};

export function Style({ css } : StyleProps) : ChildType {
    return (
        <style innerHTML={ typeof css === 'string' ? css : css._getCss() } />
    );
}
