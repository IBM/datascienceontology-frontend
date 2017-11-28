import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Grid, Col } from "react-bootstrap";

import { Annotation, PythonAnnotation, PythonObject, PythonMorphism } from "open-discovery";
import { CytoscapeComponent, displayCouchDocument } from "open-discovery-components";
import { SExpComponent } from "../components/sexp";
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
  return <dl className="dl-horizontal">
    {PythonAnnotationDefList({ annotation })},
    {annotation.kind === "object" && PythonObjectDefList({
      annotation: annotation as PythonObject
    })}
    {annotation.kind === "morphism" && PythonMorphismDefList({
      annotation: annotation as PythonMorphism
    })}
  </dl>;
}

const PythonAnnotationDefList = (props: {annotation: PythonAnnotation}) => {
  const annotation = props.annotation;
  const elements = [
    <dt key="language-dt">Language</dt>,
    <dd key="language-dd">
      <a href="https://www.python.org" target="_blank">{annotation.language}</a>
    </dd>,
    <dt key="package-dt">Package</dt>,
    <dd key="package-dd">
      <a href={`https://pypi.python.org/pypi/${annotation.package}`} target="_blank">
        {annotation.package}
      </a>
    </dd>,
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{annotation.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">{annotation.kind}</dd>,
  ];
  if (annotation.name) { elements.push(
    <dt key="name-dt">Name</dt>,
    <dd key="name-dd">{annotation.name}</dd>,
  ); }
  if (annotation.description) { elements.push(
    <dt key="description-dt">Description</dt>,
    <dd key="description-dd">{annotation.description}</dd>,
  ); }
  return elements;
}

const PythonObjectDefList = (props: {annotation: PythonObject}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  const slots = annotation.slots || [];
  return [
    <dt key="class-dt">Python class</dt>,
    <dd key="class-dd">
      <div className="annotation-class-list">
        <ul>{classes.map((className, i) =>
          <li key={i}>{className}</li>)}
        </ul>
      </div>
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <Router.Link to={`/concept/${annotation.definition}`}>
        {annotation.definition}
      </Router.Link>
    </dd>,
    <dt key="slots-dt">Slots</dt>,
    <dd key="slots-dd">
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
    </dd>,
  ];
}

const PythonMorphismDefList = (props: {annotation: PythonMorphism}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  const cacheId = `annotation/${annotation.language}/${annotation.package}/${annotation.id}`;
  const elements: JSX.Element[] = [];
  if (annotation.function) { elements.push(
    <dt key="function-dt">Python function</dt>,
    <dd key="function-dd">
      <span className="annotation-code">{annotation.function}</span>
    </dd>,
  ); }
  if (classes) { elements.push(
    <dt key="class-dt">Python class</dt>,
    <dd key="class-dd">
      <div className="annotation-class-list">
        <ul>{classes.map((className, i) =>
          <li key={i}>{className}</li>)}
        </ul>
      </div>
    </dd>,
  ); }
  if (annotation.method) { elements.push(
    <dt key="method-dt">Python method</dt>,
    <dd key="method-dd">
      <span className="annotation-code">{annotation.method}</span>
    </dd>,
  ); }
  elements.push(
    <dt key="dom-dt">Domain</dt>,
    <dd key="dom-dd">
      <div className="domain-list">
        <ol>{annotation.domain.map((ob, i) =>
          <li key={i}>{ob.slot}</li>)}
        </ol>
      </div>
    </dd>,
    <dt key="codom-dt">Codomain</dt>,
    <dd key="codom-dd">
      <div className="domain-list">
        <ol>{annotation.codomain.map((ob, i) =>
          <li key={i}>{ob.slot}</li>)}
        </ol>
      </div>
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <Grid>
        <Col md={4}>
          <SExpComponent sexp={annotation.definition} />
        </Col>
        <Col md={8}>
          <MorphismDiagramCouchDB db={Config.app_db_url} docId={cacheId} />
        </Col>
      </Grid>
    </dd>,
  );
  return elements;
}

const MorphismDiagram = (props: {doc: AnnotationCache}) => {
  const cache = props.doc;
  const cytoscape = Object.assign({}, cache.definition.cytoscape, {
    style: CytoscapeStyle
  });
  return <CytoscapeComponent cytoscape={cytoscape} height="400px" />
}
const MorphismDiagramCouchDB = displayCouchDocument(MorphismDiagram);
