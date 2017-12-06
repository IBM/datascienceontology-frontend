import * as React from "react";
import * as Router from "react-router-dom";

import { SExp } from "open-discovery";
import { MarkdownDocument } from "open-discovery-components";
import { SExpComponent } from "../components/sexp";


type MarkdownPageProps = Router.RouteComponentProps<{page: string}>;

export const MarkdownPage = (props: MarkdownPageProps) => {
  const page = props.match.params.page;
  const pageURL = `/assets/pages/${page}.md`;
  return <MarkdownDocument docURL={pageURL} options={{
    renderers: {
      sexp: (props: {value: string, children: string[]}) => {
        const sexp = JSON.parse(props.children[0]) as SExp;
        return <SExpComponent sexp={sexp} />;
      }
    },
  }} />;
}
