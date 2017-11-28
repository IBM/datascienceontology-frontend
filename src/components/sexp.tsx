import * as React from "react";
import * as Router from "react-router-dom";

import { SExp } from "open-discovery";


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
    return <span className="s-expression-head">{name}</span>;
  }
}
