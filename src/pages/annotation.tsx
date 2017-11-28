import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Grid, Col } from "react-bootstrap";

import { Annotation, PythonAnnotation, PythonObject, PythonMorphism, 
  Cytoscape, SExp } from "open-discovery";
import { CytoscapeComponent,
  displayCouchDocument } from "open-discovery-components";
import { AnnotationCache } from "../interfaces/annotation_cache";
import * as Config from "../config";

import "../../style/pages/annotation.css";
import * as CytoscapeStyle from "../../style/cytoscape.json";


interface AnnotationKey {
  language: string;
  package: string;
  id: string;
}
type AnnotationPageProps = Router.RouteComponentProps<AnnotationKey>;

export const AnnotationPage = (props: AnnotationPageProps) => {
  const key = props.match.params;
  const docId = `annotation/${key.language}/${key.package}/${key.id}`;
  return <AnnotationDisplayCouchDB db={Config.db_url} docId={docId} />;
}

export const AnnotationDisplay = (props: {doc: Annotation}) => {
  const annotation = props.doc;
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
const AnnotationDisplayCouchDB = displayCouchDocument(AnnotationDisplay);


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
  const slots = annotation.slots || [];
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
          <ul>{slots.map((slot, i) =>
            <li key={i}>
              <span className="annotation-code">
                {slot.slot}
              </span>
              {": "}
              <SExpComponent sexp={slot.definition} />
            </li>)}
          </ul>
        </div>
      </dd>
    </dl>
  );
}

const PythonMorphismDisplay = (props: {annotation: PythonMorphism}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  const cacheId = `annotation/${annotation.language}/${annotation.package}/${annotation.id}`;
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
        <Grid>
          <Col md={4}>
            <SExpComponent sexp={annotation.definition} />
          </Col>
          <Col md={8}>
            <MorphismDiagramCouchDB db={Config.app_db_url} docId={cacheId} />
          </Col>
        </Grid>
      </dd>
    </dl>
  );
}

const MorphismDiagram = (props: {doc: AnnotationCache}) => {
  const cache = props.doc;
  const cytoscape = Object.assign({}, cache.definition.cytoscape, {
    style: CytoscapeStyle
  });
  return <CytoscapeComponent cytoscape={cytoscape} height="400px" />
}
const MorphismDiagramCouchDB = displayCouchDocument(MorphismDiagram);


class SExpComponent extends React.Component<{sexp: SExp}> {
  render() {
    return <span className="s-expression">
      {this.renderSExp(this.props.sexp)}
    </span>;
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
