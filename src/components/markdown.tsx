import * as React from "react";
import { Redirect } from "react-router-dom";

import * as ReactMarkdown from "react-markdown";
import * as GrayMatter from "gray-matter";
import Slugger = require("github-slugger");

import { Link } from "./link";
import { ReactMarkdownKaTeX } from "./markdown-katex";
import { TableOfContents, ReactTableOfContents,
  remarkTableOfContents } from "./markdown-toc";
import { remarkGenericExtensions } from "../remark";

import "../../style/components/markdown.css";


interface MarkdownDocumentProps {
  /* URL of Markdown document to render. */
  docURL: string;
  
  /* Enable LaTeX math support (default false). */
  math?: boolean;
  
  /* Options to pass to react-markdown.
  
  Type is not `ReactMarkdown.ReactMarkdownProps` due to required `source` key.
  */
  options?: any;
}

interface MarkdownDocumentState {
  /* Markdown document to render. */
  doc: string;
  
  /* Error status. */
  ok: boolean;
}

/** Render a remote Markdown document.

  Title and author metadata included in the document front-matter are also
  displayed, if present.
  
  This component uses [react-markdown](https://github.com/rexxars/react-markdown)
  to render the Markdown as React components. Custom React components can be
  used as Markdown node renderers via the `renderers` option.

  Other packages that render Markdown using React include:
  - [reactdown](https://github.com/andreypopp/reactdown)
  - [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx)
  - [MDXC](https://github.com/jamesknelson/mdxc)
 */
export class MarkdownDocument
  extends React.Component<MarkdownDocumentProps,MarkdownDocumentState> {
  
  constructor(props: MarkdownDocumentProps) {
    super(props);
    this.state = { doc: null, ok: true };
  }
  
  componentDidMount() {
    this.loadDocument(this.props.docURL);
  }
  componentDidUpdate(prevProps: MarkdownDocumentProps) {
    if (this.props.docURL != prevProps.docURL) {
      this.loadDocument(this.props.docURL);
    }
  }
  shouldComponentUpdate(nextProps: MarkdownDocumentProps,
                        nextState: MarkdownDocumentState) {
    // Don't re-render when anchor links are clicked.
    // See e.g. https://github.com/gatsbyjs/gatsby/issues/462
    return !(this.props.docURL === nextProps.docURL &&
             this.state.doc === nextState.doc);
  }
  
  loadDocument(docURL: string) {
    fetch(docURL).then(response => {
      if (response.ok) {
        response.text().then(text => {
          this.setState({ doc: text, ok: true });
        });
      } else {
        this.setState({ doc: null, ok: false });
      }
    });
  }
  
  render() {
    if (!this.state.doc) {
      return this.state.ok ? null : <Redirect to="/404" />;
    }
    const options = this.props.options || {};
    const doc = GrayMatter(this.state.doc);
    const slugger = new Slugger();
    let tableOfContents: TableOfContents = [];

    const reactMarkdownProps: ReactMarkdown.ReactMarkdownProps = {
      ...options,
      astPlugins: [
        ...options.astPlugins || [],
        ...doc.data.toc ? [
          remarkTableOfContents(
            (toc: TableOfContents) => { tableOfContents = toc; },
            doc.data["toc-depth"] || 6,
          )
        ] : [],
      ],
      plugins: [
        ...options.plugins || [],
        remarkGenericExtensions,
      ],
      renderers: {
        ...options.renderers,
        heading: (props: {level: number, children: string[]}) => {
          const numbered = doc.data["number-headings"] &&
            (props.level <= (doc.data["number-headings-depth"] || 6));
          const value = props.children.join('');
          return React.createElement(`h${props.level}`, {
            className: numbered ? "numbered" : undefined,
            id: slugger.slug(value),
          }, props.children);
        },
        link: (props: {href: string, children?: any}) =>
          <Link to={props.href} target="_blank">
            {props.children}
          </Link>,
        linkReference: (props: {href: string, children?: any}) =>
          props.href === "#" ?
          <a href={`#${props.children}`.toLowerCase()}>
            {props.children}
          </a> :
          <Link to={props.href} target="_blank">
            {props.children}
          </Link>,
        definition: (props: {identifier: string, url: string }) =>
          props.url === "#" ?
          <div id={props.identifier} /> :
          null,
        toc: (props: {}) =>
          <ReactTableOfContents>{tableOfContents}</ReactTableOfContents>
      },
      source: doc.content,
    };

    return (
      <div className="markdown-document">
        {doc.data.title && <h1>{doc.data.title}</h1>}
        {doc.data.math || this.props.math ?
          <ReactMarkdownKaTeX {...reactMarkdownProps} /> :
          <ReactMarkdown {...reactMarkdownProps} />}
      </div>
    );
  }
}
