import * as React from "react";
import * as Router from "react-router-dom";
import { Container } from "reactstrap";

import { SExp } from "open-discovery";
import { CytoscapeDocument, MarkdownDocument } from "open-discovery-components";
import { SchemaGlyph, KindGlyph } from "../components/glyphs";
import { SExpComponent } from "../components/sexp";

import "../../style/pages/markdown.css";
import * as CytoscapeStyle from "../../style/pages/markdown.cytoscape.json";


type MarkdownPageProps = Router.RouteComponentProps<{page: string}>;

export const MarkdownPage = (props: MarkdownPageProps) => {
  const page = props.match.params.page;
  return <MarkdownDisplay page={page} />;
}


export const MarkdownDisplay = (props: {page: string}) => {
  const pageURL = `/assets/pages/${props.page}.md`;
  return <Container>
    <MarkdownDocument docURL={pageURL} options={{
      renderers: {
        cytoscape: (props: {value: string, children: string[]}) => {
          const docURL = `/assets/pages/${props.value}`;
          return <p>
            <CytoscapeDocument docURL={docURL}
              defaults={{
                layout: {
                  name: "preset",
                  padding: 0,
                },
                style: CytoscapeStyle as any,
                autolock: true,
                userPanningEnabled: false,
                userZoomingEnabled: false,
              }}
            />
          </p>;
        },
        sexp: (props: {value: string, children: string[]}) => {
          const sexp = JSON.parse(props.children[0]) as SExp;
          return <p><SExpComponent sexp={sexp} /></p>;
        },
        glyph_schema: (props: {value: string}) =>
          <SchemaGlyph schema={props.value} />,
        glyph_kind: (props: {value: string}) =>
          <KindGlyph kind={props.value} />,
      },
    }} />
  </Container>;
}
