import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Grid, Col } from "react-bootstrap";

import { Annotation, PythonAnnotation, PythonObject, PythonMorphism,
  AnnotationCache } from "data-science-ontology";
import { Cytoscape, SExp } from "open-discovery";
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
    Services.app_db.get(`annotation/${key.language}/${key.package}/${key.id}`)
      .then(doc => {
        const cache = doc as AnnotationCache;
        this.setState({ cytoscape: cache.definition.cytoscape});
      });
  }
  
  render() {
    const annotation = this.props.annotation;
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
        <dt>Domain</dt>
        <dd>
          <div className="domain-list">
            <ol>{annotation.domain.map((ob, i) =>
              <li key={i}>{ob.slot}</li>)}
            </ol>
          </div>
        </dd>
        <dt>Codomain</dt>
        <dd>
          <div className="domain-list">
            <ol>{annotation.codomain.map((ob, i) =>
              <li key={i}>{ob.slot}</li>)}
            </ol>
          </div>
        </dd>
        <dt>Definition</dt>
        <dd>
          <MorphismDefinition sexp={annotation.definition}
            cytoscape={this.state.cytoscape} />
        </dd>
      </dl>
    );
  }
}

const MorphismDefinition = (props: {sexp: SExp, cytoscape?: Cytoscape.Cytoscape}) => {
  const cytoscape = props.cytoscape;
  if (cytoscape === undefined || cytoscape === null) {
    return <SExpComponent sexp={props.sexp} />;
  }
  return <div className="morphism-definition">
    <Grid>
      <Col md={4}>
        <SExpComponent sexp={props.sexp} />
      </Col>
      <Col md={8}>
        <CytoscapeComponent elements={cytoscape.elements}
          layout={cytoscape.layout} style={CytoscapeStyle as any} />
      </Col>
    </Grid>
  </div>;
}

class SExpComponent extends React.Component<{sexp: SExp}> {
  render() {
    return <div className="s-expression">
      {this.renderSExp(this.props.sexp)}
    </div>;
  }
  
  renderSExp(sexp: SExp): JSX.Element {
    if (typeof sexp === "string") {
      return <Router.Link to={`/concept/${sexp}`}>{sexp}</Router.Link>;
    }
    return <ol>
      {sexp.map((term,i) => {
        let content: JSX.Element = null;
        if (i === 0) {
          content = <span className="s-expression-head">{term}</span>;
        } else {
          content = this.renderSExp(term);
        }
        return <li key={i}>{content}</li>;
      })}
    </ol>;
  }
}
