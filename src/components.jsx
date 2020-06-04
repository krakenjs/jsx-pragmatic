/* @flow */
/** @jsx node */

import { Fragment, node, type ChildType, type ChildrenType } from './node';

type StyleProps = {|
    css : string | {| _getCss : () => string |},
    nonce : ?string
|};

export function Style({ css, nonce } : StyleProps, children? : ChildrenType) : ChildType {
    return (
        <Fragment>
            <style innerHTML={ typeof css === 'string' ? css : css._getCss() } nonce={ nonce } />
            { children }
        </Fragment>
    );
}
