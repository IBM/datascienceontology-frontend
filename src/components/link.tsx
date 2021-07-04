import * as React from "react";
import * as Router from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface LinkProps {
  /* Absolute or relative URL. */
  to: string;

  /* Link target (for absolute URLs only). */
  target?: string;

  /* Child elements. */
  children?: any;
}

/** Link component that handles both absolute and relative URLs.

  Absolute URLs map to <a> tags and relative URLs map to React Router links.
  For related approaches to this problem, see this React Router
  [issue](https://github.com/ReactTraining/react-router/issues/1147)
 */
export const Link = (props: LinkProps) =>
  isAbsoluteURL.test(props.to) ? (
    <a href={props.to} target={props.target}>
      {props.children}{" "}
      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" transform="up-2" />
    </a>
  ) : (
    <Router.Link to={props.to}>{props.children}</Router.Link>
  );

// Regex from StackOverflow: https://stackoverflow.com/questions/10687099
const isAbsoluteURL = /^(?:[a-z]+:)?\/\//i;
