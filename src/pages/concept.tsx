import * as React from "react";
import * as Router from "react-router-dom";

import { Concept } from "data-science-ontology-backend";
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
    const id = this.props.match.params.id;
    Services.db.get(`concept/data-science/${id}`)
      .then(doc => {
        this.setState({concept: doc as Concept});
      });
  }
  
  render() {
    return this.state.concept && <ConceptDisplay concept={this.state.concept} />;
  }
}


export const ConceptDisplay = (props: {concept: Concept}) => {
  const concept = props.concept;
  return (
    <div className="concept">
      <h3>{concept.name}</h3>
      <dl className="dl-horizontal" key="fields">
        <dt>ID</dt>
        <dd>{concept.id}</dd>
        <dt>Kind</dt>
        <dd>{concept.kind}</dd>
        <dt>Name</dt>
        <dd>{concept.name}</dd>
        {concept.description && <dt>Description</dt>}
        {concept.description && <dd>{concept.description}</dd>}
      </dl>
    </div>
  );
}
