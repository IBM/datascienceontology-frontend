import * as React from "react";
import FontAwesome = require("react-fontawesome");


/** Glyph for kind of concept or annotation.
 */
export const KindGlyph = (props: {kind: string}) => {
  if (props.kind === "object") {
    return <FontAwesome name="circle-o" />;
  } else if (props.kind === "morphism") {
    return <FontAwesome name="long-arrow-right" />;
  }
  return null;
}
