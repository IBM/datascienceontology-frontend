import * as React from "react";
import * as Router from "react-router-dom";

import { Concept, MorphismConcept, DomainObject } from "data-science-ontology";
import * as Services from "../services";

import "../../style/pages/concept.css";


type ConceptPageProps = Router.RouteComponentProps<{id: string}>;

interface ConceptPageState {
  concept: Concept;
}

export class ConceptPage extends React.Component<ConceptPageProps,ConceptPageState> {
  constructor(props: ConceptPageProps) {
    super(props);
    this.state = { concept: null };
  }
  
  componentWillMount() {
    this.setConcept(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps: ConceptPageProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setConcept(nextProps.match.params.id);
    }
  }
  
  setConcept(id: string) {
    Services.db.get(`concept/data-science/${id}`)
      .then(doc => {
        this.setState({concept: doc as Concept});
      });
  }
  
  render() {
    return this.state.concept && <ConceptDisplay concept={this.state.concept}/>;
  }
}


export const ConceptDisplay = (props: {concept: Concept}) => {
  const concept = props.concept
  const superconcepts = concept.subconcept === undefined ? null :
    <div className="subconcept-list">
      <ul>{concept.subconcept.map((id,i) =>
        <li key={i}>
          <Router.Link key={id} to={`/concept/${id}`}>{id}</Router.Link>
        </li>)}
      </ul>
    </div>;
  const kindDisplay = concept.kind == "morphism" ?
    <MorphismDisplay concept={concept as MorphismConcept} /> : null;
  
  return (
    <div className="concept">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          Concept
        </span>
        {concept.name}
      </h3>
      <dl className="dl-horizontal" style={{marginBottom: 0}}>
        <dt>ID</dt>
        <dd>{concept.id}</dd>
        <dt>Kind</dt>
        <dd>{concept.kind}</dd>
        <dt>Name</dt>
        <dd>{concept.name}</dd>
        {concept.description && <dt>Description</dt>}
        {concept.description && <dd>{concept.description}</dd>}
        {superconcepts && <dt>Is</dt>}
        {superconcepts && <dd>{superconcepts}</dd>}
      </dl>
      {kindDisplay}
    </div>
  );
}

const MorphismDisplay = (props: {concept: MorphismConcept}) => {
  const concept = props.concept;
  return <dl className="dl-horizontal">
    <dt>Domain</dt>
    <dd><DomainObjectsDisplay objects={concept.domain} /></dd>
    <dt>Codomain</dt>
    <dd><DomainObjectsDisplay objects={concept.codomain} /></dd>
  </dl>;
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
