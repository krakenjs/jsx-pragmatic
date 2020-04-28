/* @flow */
/** @jsx node */

import { Fragment, node, type ChildType, type ChildrenType } from './node';

type StyleProps = {|
    css : string | {| _getCss : () => string |}
|};

export function Style({ css } : StyleProps, children? : ChildrenType) : ChildType {
    return (
        <Fragment>
            <style innerHTML={ typeof css === 'string' ? css : css._getCss() } />
            { children }
        </Fragment>
    );
}
