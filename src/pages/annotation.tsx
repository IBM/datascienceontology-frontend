import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";

import { Annotation, PythonAnnotation } from "data-science-ontology";
import * as Services from "../services";

import "../../style/pages/annotation.css";


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
  let inner = null;
  if (annotation.language == "python") {
    inner = <PythonAnnotationDisplay annotation={annotation as PythonAnnotation} />;
  }
  return (
    <div className="annotation">
      <h3>
        <span className="text-muted" style={{"padding-right": "2em"}}>
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      {inner}
    </div>
  );
}

const PythonAnnotationDisplay = (props: {annotation: PythonAnnotation}) => {
  const annotation = props.annotation;
  return (
    <dl className="dl-horizontal" key="fields">
      <dt>Language</dt>
      <dd>
        <a href="https://docs.python.org">{annotation.language}</a>
      </dd>
      <dt>Package</dt>
      <dd>
        <a href={`https://pypi.python.org/pypi/${annotation.package}`}>
          {annotation.package}
        </a>
      </dd>
      <dt>ID</dt>
      <dd>{annotation.id}</dd>
      <dt>Kind</dt>
      <dd>{annotation.kind}</dd>
      {annotation.name && <dt>Name</dt>}
      {annotation.name && <dd>{annotation.name}</dd>}
      {annotation.description && <dt>Description</dt>}
      {annotation.description && <dd>{annotation.description}</dd>}
      {annotation.class && <dt>Python class</dt>}
      {annotation.class && <dd>
        <div className="annotation-class-list">
          <ul>{annotation.class.map((className, i) =>
            <li key={i}>{className}</li>)}
          </ul>
        </div>
       </dd>}
    </dl>
  );
}
