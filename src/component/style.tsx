/** @jsx node */
import type { ChildType, NullableChildrenType } from "../node";
import { Fragment, node } from "../node";
type StyleProps = {
  css:
    | string
    | {
        _getCss: () => string;
      };
  nonce?: string | null | undefined;
  children?: NullableChildrenType | null | undefined;
};
export function Style({ css, nonce, children }: StyleProps): ChildType {
  return (
    <Fragment>
      <style
        innerHTML={typeof css === "string" ? css : css._getCss()}
        nonce={nonce}
      />
      {children}
    </Fragment>
  );
}
