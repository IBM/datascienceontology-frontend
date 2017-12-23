import * as React from "react";
import FontAwesome = require("react-fontawesome");

import "../../style/components/glyphs.css";


/** Glyph for document schema.
 */
export const SchemaGlyph = (props: {schema: string}) => {
  if (props.schema === "concept") {
    return <FontAwesome name="cloud" />;
  } else if (props.schema === "annotation") {
    return <FontAwesome name="pencil-square-o" />;
  }
  return null;
}

/** Glyph for kind of concept or annotation.
 */
export const KindGlyph = (props: {kind: string}) => {
  if (props.kind === "object") {
    return <FontAwesome name="cube" />;
  } else if (props.kind === "morphism") {
    return <FontAwesome name="long-arrow-right" />;
  }
  return null;
}

/** Glyph for programming language of annotation.
 */
export const LanguageGlyph = (props: {language: string}) =>
  <img src={`/assets/images/logo-${props.language}.svg`}
       alt={props.language}
       className="language-glyph" />;
