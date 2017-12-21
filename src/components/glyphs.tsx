import * as React from "react";
import FontAwesome = require("react-fontawesome");

import "../../style/components/glyphs.css";


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

/** Glyph for programming language.
 */
export const LanguageGlyph = (props: {language: string}) =>
  <img src={`/assets/images/logo-${props.language}.svg`}
       alt={props.language} className="language-glyph" />;
