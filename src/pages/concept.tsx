import * as React from "react";
import * as Router from "react-router-dom";

import { Concept } from "data-science-ontology";
import * as Services from "../services";


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
    (concept.subconcept || []).map(id =>
      <Router.Link key={id} to={`/concept/${id}`}>{id}</Router.Link>);
  return (
    <div className="concept">
      <h3>
        <span className="text-muted" style={{"padding-right": "2em"}}>
          Concept
        </span>
        {concept.name}
      </h3>
      <dl className="dl-horizontal" key="fields">
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
    </div>
  );
}
