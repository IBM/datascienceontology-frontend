import * as React from "react";
import * as KaTeX from "katex";


interface KaTeXProps {
  children?: string;
  display?: boolean;
  options?: KaTeX.KatexOptions;
}

interface KaTeXState {
  html: string;
}

/** Render LaTeX math inside a React component using KaTeX.
 */
export class KaTeXMath extends React.Component<KaTeXProps,KaTeXState> {
  constructor(props: KaTeXProps) {
    super(props);
    this.state = { html: null };
  }
  
  componentWillMount() {
    this.generateHTML(this.props.children);
  }
  componentWillReceiveProps(nextProps: KaTeXProps) {
    if (nextProps.children !== this.props.children) {
      this.generateHTML(nextProps.children);
    }
  }

  generateHTML(latex: string) {
    const html = KaTeX.renderToString(latex, {
      ...this.props.options,
      displayMode: this.props.display,
    });
    this.setState({ html });
  }

  render() {
    if (!this.state.html)
      return null;
    const element = this.props.display ? "div" : "span";
    return React.createElement(element, {
      dangerouslySetInnerHTML: { __html: this.state.html }
    });
  }
}