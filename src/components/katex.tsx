import * as React from "react";
import * as KaTeX from "katex";

import "../../node_modules/katex/dist/katex.css";

interface KaTeXProps {
  children?: string;
  display?: boolean;
  options?: KaTeX.KatexOptions;
}

interface KaTeXState {
  html?: string;
}

/** Render LaTeX math inside a React component using KaTeX.
 */
export class KaTeXMath extends React.Component<KaTeXProps, KaTeXState> {
  constructor(props: KaTeXProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.children) this.generateHTML(this.props.children);
  }
  componentDidUpdate(prevProps: KaTeXProps) {
    if (this.props.children !== prevProps.children) {
      if (this.props.children) this.generateHTML(this.props.children);
    }
  }

  generateHTML(latex: string) {
    const html = KaTeX.renderToString(latex, {
      ...this.props.options,
      displayMode: this.props.display
    });
    this.setState({ html });
  }

  render() {
    const element = this.props.display ? "div" : "span";
    return React.createElement(element, {
      dangerouslySetInnerHTML: { __html: this.state.html }
    });
  }
}
