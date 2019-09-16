import * as React from "react";
import * as Router from "react-router-dom";
import { Content } from "react-bulma-components";
import { registerLanguage } from "highlight.js/lib/highlight";

import { SExp } from "../interfaces/expression";
import { MarkdownDocument } from "../components/markdown";
import { SchemaGlyph, KindGlyph } from "../components/glyphs";
import { Highlight } from "../components/highlight";
import { SExpComponent } from "../components/sexp";
import { WiringDiagramDocument } from "../components/wiring-diagram";

import "../../style/pages/markdown.css";

import * as yaml from "highlight.js/lib/languages/yaml";
registerLanguage("yaml", yaml);


type MarkdownPageProps = Router.RouteComponentProps<{page: string}>;

export const MarkdownPage = (props: MarkdownPageProps) => {
  const page = props.match.params.page;
  return <MarkdownDisplay page={page}/>;
}


export const MarkdownDisplay = (props: {page: string}) => {
  const pageURL = `/assets/pages/${props.page}.md`;
  return <Content>
    <MarkdownDocument docURL={pageURL} options={{
      renderers: {
        code: (props: {language: string, value: string}) => 
          <Highlight language={props.language}>
            {props.value}
          </Highlight>,
        sexp: (props: {value: string}) => {
          const sexp = JSON.parse(props.value) as SExp;
          return <div className="markdown-figure">
            <SExpComponent sexp={sexp}/>
          </div>;
        },
        wiringdiagram: (props: {value: string, children: string[]}) => {
          const docURL = `/assets/pages/${props.value}`;
          return <div className="markdown-figure">
            <WiringDiagramDocument url={docURL}/>
          </div>;
        },
        glyph_schema: (props: {value: string}) =>
          <SchemaGlyph schema={props.value} />,
        glyph_kind: (props: {value: string}) =>
          <KindGlyph kind={props.value} />,
      },
    }} />
  </Content>;
}