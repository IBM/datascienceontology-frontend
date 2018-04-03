import * as React from "react";
import * as Router from "react-router-dom";
import * as ReactMarkdown from "react-markdown";

import { Concept } from "open-discovery";
import { displayCouchDocument, Link } from "open-discovery-components";
import { KindGlyph, SchemaGlyph } from "../components/glyphs";
import * as Config from "../config";

import "../../style/pages/concept.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWikipediaW } from "@fortawesome/fontawesome-free-brands";


type ConceptPageProps = Router.RouteComponentProps<{id: string}>;

export const ConceptPage = (props: ConceptPageProps) => {
  const id = props.match.params.id;
  const docId = `concept/data-science/${id}`;
  return <ConceptDisplayCouchDB dbURL={Config.dbURL} dbName={Config.dbName}
    docId={docId} />;
}

export const ConceptDisplay = (props: {doc?: Concept.Concept}) => {
  const concept = props.doc;
  return concept && (
    <section id="concept">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          <SchemaGlyph schema="concept" />
          {" "}
          Concept
        </span>
        {concept.name}
      </h3>
      <dl className="dl-horizontal">
        {ConceptDefList({ concept })}
        {Concept.isMorphism(concept) && MorphismDefList({ concept })}
      </dl>
    </section>
  );
}
const ConceptDisplayCouchDB = displayCouchDocument(ConceptDisplay);


const ConceptDefList = (props: {concept: Concept.Concept}) => {
  const concept = props.concept;
  const external = concept.external;
  const externalLinks = external === undefined ? null :
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
    </ul>;
  const superconcepts = concept.subconcept === undefined ? null :
    <ul className="subconcept-list">{concept.subconcept.map((id,i) =>
      <li key={i}>
        <Router.Link key={id} to={`/concept/${id}`}>{id}</Router.Link>
      </li>)}
    </ul>;
  const elements = [
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{concept.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">
      <KindGlyph kind={concept.kind} />
      {" "}
      {concept.kind === "object" ? "type" : "function"}
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
    <dd key="sub-dd">{superconcepts}</dd>,
  ); }
  if (externalLinks) { elements.push(
    <dt key="external-dt">External links</dt>,
    <dd key="external-dd">{externalLinks}</dd>,
  ); }
  return elements;
}

const MorphismDefList = (props: {concept: Concept.Morphism}) => {
  const concept = props.concept;
  return [
    <dt key="dom-dt">Input</dt>,
    <dd key="dom-dd"><DomainObjectsDisplay objects={concept.domain} /></dd>,
    <dt key="codom-dt">Output</dt>,
    <dd key="codom-dd"><DomainObjectsDisplay objects={concept.codomain} /></dd>,
  ];
}

const DomainObjectsDisplay = (props: {objects: Concept.DomainObject[]}) => {
  return <div className="concept-domain-list">
    <ol>{props.objects.map((object,i) =>
      <li key={i}>
        <DomainObjectDisplay object={object} />
      </li>)}
    </ol>
  </div>;
}

const DomainObjectDisplay = (props: {object: Concept.DomainObject}) => {
  const obj = props.object;
  return <div className="concept-domain-object">
    {obj.name !== undefined && `${obj.name}: `}
    <Router.Link to={`/concept/${obj.object}`}>{obj.object}</Router.Link>
    {obj.description !== undefined && <p className="text-muted">
      {obj.description}
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
    <span className="text-muted text-nowrap">
      ({concept.id})
    </span>
  </span>;
}
