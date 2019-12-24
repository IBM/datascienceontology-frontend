import * as React from "react";

import { highlightBlock } from "highlight.js/lib/highlight";
//import "highlight.js/styles/color-brewer.css";
import "highlight.js/styles/github.css";

interface HighlightProps {
  language: string;
}

export class Highlight extends React.Component<HighlightProps> {
  private _code?: HTMLElement = undefined;

  highlight() {
    highlightBlock(this._code);
  }

  componentDidMount() {
    this.highlight();
  }
  componentDidUpdate() {
    this.highlight();
  }

  render() {
    return (
      <pre>
        <code
          className={`language-${this.props.language}`}
          ref={elem => {
            this._code = elem || undefined;
          }}
        >
          {this.props.children}
        </code>
      </pre>
    );
  }
}
