import * as React from "react";
import * as Router from "react-router-dom";
import { Content } from "react-bulma-components";
import { registerLanguage } from "highlight.js/lib/highlight";

import { WiringDiagramCanvas, Diagrams, Graphviz, copyDiagramLayoutProperties,
  mergeDiagramLayout, parseGraphvizLayout } from "wiring-diagram-canvas";
import { SExp } from "../interfaces/expression";
import { displayResponseData } from "../components/higher-order";
import { MarkdownDocument } from "../components/markdown";
import { SchemaGlyph, KindGlyph } from "../components/glyphs";
import { Highlight } from "../components/highlight";
import { SExpComponent } from "../components/sexp";

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
            <WiringDiagramRequest url={docURL}/>
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


interface WiringDiagramData {
  diagram: Diagrams.WiringDiagram,
  graphviz?: Graphviz.Graph,
}

const WiringDiagramDisplay = (props: {data?: WiringDiagramData}) => {
  if (!props.data)
    return null;
  const diagram = props.data.diagram;
  copyDiagramLayoutProperties(diagram);
  if (props.data.graphviz) {
    const layout = parseGraphvizLayout(props.data.graphviz);
    mergeDiagramLayout(diagram, layout);
  }
  return <WiringDiagramCanvas diagram={diagram}/>;
}

const WiringDiagramRequest = displayResponseData(WiringDiagramDisplay);