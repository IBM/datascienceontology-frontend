import * as React from "react";
import * as Router from "react-router-dom";
import * as ReactMarkdown from "react-markdown";
import { Heading } from "react-bulma-components";

import * as Concept from "../interfaces/concept";
import { KindGlyph, SchemaGlyph } from "../components/glyphs";
import { displayResponseData } from "../components/higher-order";
import { Link } from "../components/link";
import { apiUrl } from "../config";

import "../../style/pages/concept.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";


type ConceptPageProps = Router.RouteComponentProps<{id: string}>;

export const ConceptPage = (props: ConceptPageProps) => {
  const id = props.match.params.id;
  return <ConceptDisplayRequest url={`${apiUrl}/concept/${id}`} />;
}

export const ConceptDisplay = (props: {data?: Concept.Concept}) => {
  const concept = props.data;
  return concept && (
    <section id="concept">
      <Heading size={3}>
        <span className="has-text-grey has-margin-right-75">
          <SchemaGlyph schema="concept" />
          {" "}
          Concept
        </span>
        {concept.name}
        <a className="has-text-grey" title="Edit on GitHub"
           href={`https://github.com/IBM/datascienceontology/tree/master/concept/${concept.id}.yml`}>
          <FontAwesomeIcon icon={faEdit} className="is-pulled-right" />
        </a>
      </Heading>
      <dl className="dl-horizontal">
        {ConceptDefList({ concept })}
        {Concept.isFunction(concept) && FunctionConceptDefList({ concept })}
      </dl>
    </section>
  );
}
const ConceptDisplayRequest = displayResponseData(ConceptDisplay);


const ConceptDefList = (props: {concept: Concept.Concept}) => {
  const concept = props.concept;
  const superconcept = concept["is-a"];
  const superconcepts = superconcept === undefined ? null :
    (typeof superconcept === "string" ? [ superconcept ] : superconcept);
  const external = concept.external;
  const elements = [
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{concept.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">
      <KindGlyph kind={concept.kind} />
      {" "}
      {concept.kind}
    </dd>,
    <dt key="name-dt">Name</dt>,
    <dd key="name-dd">{concept.name}</dd>,
  ];
  if (concept.description) { elements.push(
    <dt key="description-dt">Description</dt>,
    <dd key="description-dd" className="concept-description">
      <ReactMarkdown source={concept.description}/>
    </dd>,
  ); }
  if (superconcepts) { elements.push(
    <dt key="sub-dt">Is</dt>,
    <dd key="sub-dd">
      <ul className="subconcept-list">{superconcepts.map((id,i) =>
        <li key={i}>
          <Router.Link key={id} to={`/concept/${id}`}>{id}</Router.Link>
        </li>)}
      </ul>
    </dd>,
  ); }
  if (external) { elements.push(
    <dt key="external-dt">External links</dt>,
    <dd key="external-dd">
      <ul className="external-link-list">
      {external.wikipedia &&
        <li>
          <FontAwesomeIcon icon={faWikipediaW} className="mr-1" />
          <Link to={`https://en.wikipedia.org/wiki/${external.wikipedia}`} target="_blank">
            {external.wikipedia.replace(/_/g, " ")}
          </Link>
        </li>}
      {external.wikidata &&
        <li>
          <img src="/assets/images/logo-wikidata.svg" alt="Wikidata logo"
               style={{height: "1.2em"}} />
          <Link to={`https://www.wikidata.org/wiki/${external.wikidata}`} target="_blank">
            {external.wikidata}
          </Link>
        </li>}
      </ul>
    </dd>,
  ); }
  return elements;
}

const FunctionConceptDefList = (props: {concept: Concept.FunctionConcept}) => {
  const concept = props.concept;
  return [
    <dt key="dom-dt">Inputs</dt>,
    <dd key="dom-dd"><PortsDisplay ports={concept.inputs} /></dd>,
    <dt key="codom-dt">Outputs</dt>,
    <dd key="codom-dd"><PortsDisplay ports={concept.outputs} /></dd>,
  ];
}

const PortsDisplay = (props: {ports: Concept.Port[]}) => {
  return <div className="concept-port-list">
    <ol>{props.ports.map((port,i) =>
      <li key={i}>
        <PortDisplay port={port} />
      </li>)}
    </ol>
  </div>;
}

const PortDisplay = (props: {port: Concept.Port}) => {
  const port = props.port;
  return <div className="concept-port">
    {port.name !== undefined && `${port.name}: `}
    <Router.Link to={`/concept/${port.type}`}>{port.type}</Router.Link>
    {port.description !== undefined && <p className="has-text-grey">
      {port.description}
    </p>}
  </div>;
}


export const ConceptFullName = (props: {concept: Concept.Concept}) => {
  const concept = props.concept;
  return <span>
    <Router.Link to={`/concept/${concept.id}`}>
      {concept.name}
    </Router.Link>
    {" "}
    <span className="has-text-grey">
      ({concept.id})
    </span>
  </span>;
}
