import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";

import { Annotation, PythonAnnotation, PythonObject, PythonMorphism,
  Cache, Cytoscape } from "data-science-ontology";
import { CytoscapeComponent } from "../components/cytoscape";
import * as Services from "../services";

import "../../style/pages/annotation.css";
import * as CytoscapeStyle from "../../style/cytoscape.json";


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
  let languageDisplay = null;
  if (annotation.language == "python") {
    languageDisplay = <PythonAnnotationDisplay annotation={annotation as PythonAnnotation} />;
  }
  return (
    <div className="annotation">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      {languageDisplay}
    </div>
  );
}

const PythonAnnotationDisplay = (props: {annotation: PythonAnnotation}) => {
  const annotation = props.annotation;
  const pythonDisplay = <dl className="dl-horizontal" style={{marginBottom: 0}}>
    <dt>Language</dt>
    <dd>
      <a href="https://www.python.org" target="_blank">{annotation.language}</a>
    </dd>
    <dt>Package</dt>
    <dd>
      <a href={`https://pypi.python.org/pypi/${annotation.package}`} target="_blank">
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
  </dl>;
  
  let kindDisplay = null;
  if (annotation.kind == "object") {
    kindDisplay = <PythonObjectDisplay annotation={annotation as PythonObject} />;
  } else if (annotation.kind == "morphism") {
    kindDisplay = <PythonMorphismDisplay annotation={annotation as PythonMorphism} />;
  }
  
  return <div className="python-annotation">
    {pythonDisplay}
    {kindDisplay}
  </div>;
}


const PythonObjectDisplay = (props: {annotation: PythonObject}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  return (
    <dl className="dl-horizontal">
      <dt>Python class</dt>
      <dd>
        <div className="annotation-class-list">
          <ul>{classes.map((className, i) =>
            <li key={i}>{className}</li>)}
          </ul>
        </div>
      </dd>
      <dt>Definition</dt>
      <dd>
        <Router.Link to={`/concept/${annotation.definition}`}>
          {annotation.definition}
        </Router.Link>
      </dd>
      <dt>Slots</dt>
      <dd>
        <div className="slot-list">
          <ul>{Object.keys(annotation.slots || {}).map(key => 
            <li key={key}>
              <Router.Link to={`/concept/${key}`}>
                {key}
              </Router.Link>
              {": "}
              <span className="annotation-code">
                {annotation.slots[key]}
              </span>
            </li>)}
          </ul>
        </div>
      </dd>
    </dl>
  );
}


interface PythonMorphismProps {
  annotation: PythonMorphism;
}
interface PythonMorphismState {
  cytoscape: Cytoscape.Cytoscape;
}

export class PythonMorphismDisplay extends React.Component<PythonMorphismProps,PythonMorphismState> {
  constructor(props: PythonMorphismProps) {
    super(props);
    this.state = { cytoscape: null };
  }
  
  componentWillMount() {
    this.loadCache(this.props.annotation);
  }
  
  loadCache(key: AnnotationKey) {
    Services.db.get(`cache/annotation/${key.language}/${key.package}/${key.id}`)
      .then(doc => {
        this.setState({ cytoscape: (doc as Cache).definition.cytoscape});
      });
  }
  
  render() {
    const annotation = this.props.annotation;
    const cytoscape = this.state.cytoscape;
    const classes = typeof annotation.class === "string" ?
      [ annotation.class ] : annotation.class;
    return (
      <dl className="dl-horizontal">
        {annotation.function && <dt>Python function</dt>}
        {annotation.function && <dd>
          <span className="annotation-code">{annotation.function}</span>
        </dd>}
        {classes && <dt>Python class</dt>}
        {classes && <dd>
          <div className="annotation-class-list">
            <ul>{classes.map((className, i) =>
              <li key={i}>{className}</li>)}
            </ul>
          </div>
        </dd>}
        {annotation.method && <dt>Python method</dt>}
        {annotation.method && <dd>
          <span className="annotation-code">{annotation.method}</span>
        </dd>}
        {cytoscape && <dt>Definition</dt>}
        {cytoscape && <dd>
          <CytoscapeComponent elements={cytoscape.elements}
            layout={cytoscape.layout} style={CytoscapeStyle as any} />
         </dd>}
      </dl>
    );
  }
}
