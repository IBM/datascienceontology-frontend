import * as React from "react";
import * as Router from "react-router-dom";

import { SExp } from "open-discovery";

import "../../style/components/sexp.css";


/** Display an S-expression as a term tree.
 */
export class SExpComponent extends React.Component<{sexp: SExp}> {
  render() {
    return <span className="s-expression">
      {this.renderSExp(this.props.sexp)}
    </span>;
  }
  
  renderSExp(sexp: SExp): JSX.Element {
    if (typeof sexp === "string") {
      return <Router.Link to={`/concept/${sexp}`}>{sexp}</Router.Link>;
    }
    return <ol>
      {sexp.map((term,i) => {
        let content: JSX.Element = null;
        if (i === 0 && typeof term === "string") {
          content = this.renderSExpHead(term);
        } else {
          content = this.renderSExp(term);
        }
        return <li key={i}>{content}</li>;
      })}
    </ol>;
  }
  
  renderSExpHead(name: string): JSX.Element {
    return <span className="s-expression-head">
      {displayNames.hasOwnProperty(name) ?
        displayNames[name] : name}
    </span>;
  }
}

/** User-friendtly names to display for the head symbols of S-expressions.
 */
const displayNames: { [name: string]: string; } = {
  // Type constructors
  Ob: "Type",
  Hom: "Function",
  SubOb: "Subtype",
  SubHom: "Subfunction",
  
  // Term constructors
  otimes: "product",
  munit: "unit",
};
