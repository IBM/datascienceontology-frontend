import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faLightbulb, faStickyNote} from "@fortawesome/free-regular-svg-icons";
import { faCube, faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";

import "../../style/components/glyphs.css";


/** Glyph for document schema.
 */
export const SchemaGlyph = (props: {schema: string}) => {
  if (props.schema === "concept") {
    return <FontAwesomeIcon icon={faLightbulb} />;
  } else if (props.schema === "annotation") {
    return <FontAwesomeIcon icon={faStickyNote} />;
  }
  return null;
}

/** Glyph for kind of concept or annotation.
 */
export const KindGlyph = (props: {kind: string}) => {
  if (props.kind === "type") {
    return <FontAwesomeIcon icon={faCube} />;
  } else if (props.kind === "function") {
    return <FontAwesomeIcon icon={faLongArrowAltRight} />;
  }
  return null;
}

/** Glyph for programming language of annotation.
 */
export const LanguageGlyph = (props: {language: string}) =>
  <img src={`/assets/images/logo-${props.language}.svg`}
       alt={props.language}
       className="language-glyph" />;
