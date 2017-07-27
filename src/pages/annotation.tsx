import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";

import { Annotation } from "data-science-ontology";
import * as Services from "../services";


interface AnnotationKey {
  language: string;
  package: string;
  id: string;
}
type AnnotationPageProps = Router.RouteComponentProps<AnnotationKey>;

interface AnnotationPageState {
  annotation: Annotation;
}

export class AnnotationPage extends React.Component<AnnotationPageProps,AnnotationPageState> {
  constructor(props: AnnotationPageProps) {
    super(props);
    this.state = { annotation: null };
  }
  
  componentWillMount() {
    this.setAnnotation(this.props.match.params);
  }
  componentWillReceiveProps(nextProps: AnnotationPageProps) {
    if (!_.isEqual(this.props.match.params, nextProps.match.params)) {
      this.setAnnotation(nextProps.match.params);
    }
  }
  
  setAnnotation(key: AnnotationKey) {
    Services.db.get(`annotation/${key.language}/${key.package}/${key.id}`)
      .then(doc => {
        this.setState({annotation: doc as Annotation});
      });
  }
  
  render() {
    return this.state.annotation &&
      <AnnotationDisplay annotation={this.state.annotation}/>;
  }  
}


export const AnnotationDisplay = (props: {annotation: Annotation}) => {
  const annotation = props.annotation;
  return (
    <div className="annotation">
      <h3>
        <span className="text-muted" style={{"padding-right": "2em"}}>
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      <dl className="dl-horizontal" key="fields">
        <dt>Language</dt>
        <dd>{annotation.language}</dd>
        <dt>Package</dt>
        <dd>{annotation.package}</dd>
        <dt>ID</dt>
        <dd>{annotation.id}</dd>
        <dt>Kind</dt>
        <dd>{annotation.kind}</dd>
        {annotation.name && <dt>Name</dt>}
        {annotation.name && <dd>{annotation.name}</dd>}
        {annotation.description && <dt>Description</dt>}
        {annotation.description && <dd>{annotation.description}</dd>}
      </dl>
    </div>
  );
}
