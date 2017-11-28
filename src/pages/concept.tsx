import * as React from "react";
import * as Router from "react-router-dom";

import { Concept, MorphismConcept, DomainObject } from "open-discovery";
import { displayCouchDocument } from "open-discovery-components";
import * as Config from "../config";

import "../../style/pages/concept.css";


type ConceptPageProps = Router.RouteComponentProps<{id: string}>;

export const ConceptPage = (props: ConceptPageProps) => {
  const id = props.match.params.id;
  const docId = `concept/data-science/${id}`;
  return <ConceptDisplayCouchDB db={Config.db_url} docId={docId} />;
}

export const ConceptDisplay = (props: {doc: Concept}) => {
  const concept = props.doc;
  return (
    <div className="concept">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          Concept
        </span>
        {concept.name}
      </h3>
      <dl className="dl-horizontal">
        {ConceptDefList({ concept })}
        {concept.kind === "morphism" && MorphismDefList({
          concept: concept as MorphismConcept,
        })}
      </dl>
    </div>
  );
}
const ConceptDisplayCouchDB = displayCouchDocument(ConceptDisplay);


const ConceptDefList = (props: {concept: Concept}) => {
  const concept = props.concept;
  const superconcepts = concept.subconcept === undefined ? null :
    <div className="subconcept-list">
      <ul>{concept.subconcept.map((id,i) =>
        <li key={i}>
          <Router.Link key={id} to={`/concept/${id}`}>{id}</Router.Link>
        </li>)}
      </ul>
    </div>;
  const elements = [
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{concept.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">{concept.kind}</dd>,
    <dt key="name-dt">Name</dt>,
    <dd key="name-dd">{concept.name}</dd>,
  ];
  if (concept.description) { elements.push(
    <dt key="description-dt">Description</dt>,
    <dd key="description-dd">{concept.description}</dd>,
  ); }
  if (superconcepts) { elements.push(
    <dt key="sub-dt">Is</dt>,
    <dd key="sub-dd">{superconcepts}</dd>,
  ); }
  return elements;
}

const MorphismDefList = (props: {concept: MorphismConcept}) => {
  const concept = props.concept;
  return [
    <dt key="dom-dt">Domain</dt>,
    <dd key="dom-dd"><DomainObjectsDisplay objects={concept.domain} /></dd>,
    <dt key="codom-dt">Codomain</dt>,
    <dd key="codom-dd"><DomainObjectsDisplay objects={concept.codomain} /></dd>,
  ];
}

const DomainObjectsDisplay = (props: {objects: DomainObject[]}) => {
  return <div className="domain-object-list">
    <ol>{props.objects.map((object,i) =>
      <li key={i}>
        <DomainObjectDisplay object={object} />
      </li>)}
    </ol>
  </div>;
}

const DomainObjectDisplay = (props: {object: DomainObject}) => {
  const obj = props.object;
  return <div className="domain-object">
    {obj.name !== undefined && `${obj.name}: `}
    <Router.Link to={`/concept/${obj.object}`}>{obj.object}</Router.Link>
    {obj.description !== undefined && <p className="text-muted">
      {obj.description}
    </p>}
  </div>;
}
