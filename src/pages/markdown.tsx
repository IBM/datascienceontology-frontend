import * as React from "react";
import * as Router from "react-router-dom";

import { MarkdownDocument } from "open-discovery-components";


type MarkdownPageProps = Router.RouteComponentProps<{page: string}>;

export const MarkdownPage = (props: MarkdownPageProps) => {
  const page = props.match.params.page;
  const pageURL = `/assets/pages/${page}.md`;
  return <MarkdownDocument docURL={pageURL} />;
}
