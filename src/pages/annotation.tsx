import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import * as ReactMarkdown from "react-markdown";
import { Container, Row, Col } from "reactstrap";

import { Annotation } from "open-discovery";
import { CytoscapeComponent, Link, displayCouchDocument }
  from "open-discovery-components";
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

export const AnnotationDisplay = (props: {doc: Annotation.Annotation}) => {
  const annotation = props.doc;
  return (
    <section id="annotation">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      {Annotation.isPythonAnnotation(annotation) &&
        <PythonAnnotationDisplay annotation={annotation} />}
    </section>
  );
}
const AnnotationDisplayCouchDB = displayCouchDocument(AnnotationDisplay);


const PythonAnnotationDisplay = (props: {annotation: Annotation.PythonAnnotation}) => {
  const annotation = props.annotation;
  if (Annotation.isPythonObject(annotation)) {
    return (
      <dl className="dl-horizontal">
        {PythonAnnotationDefList({ annotation })}
        {PythonObjectDefList({ annotation })}
      </dl>
    );
  } else if (Annotation.isPythonMorphism(annotation)) {
    const cacheId = `annotation/${annotation.language}/${annotation.package}/${annotation.id}`;
    return (
      <Container>
        <Row>
          <Col>
            <dl className="dl-horizontal">
              {PythonAnnotationDefList({ annotation })}
              {PythonMorphismDefList({ annotation })}
            </dl>
          </Col>
          <Col>
            <MorphismDiagramCouchDB db={Config.app_db_url} docId={cacheId} />
          </Col>
        </Row>
      </Container>
    );
  }
  return null;
}

const PythonAnnotationDefList = (props: {annotation: Annotation.PythonAnnotation}) => {
  const annotation = props.annotation;
  const elements = [
    <dt key="language-dt">Language</dt>,
    <dd key="language-dd">
      {annotation.language}
      {" "}
      <a href="https://www.python.org/" target="_blank">
        <img src="/assets/images/logo-python.svg" width="24" height="24" />
      </a>
    </dd>,
    <dt key="package-dt">Package</dt>,
    <dd key="package-dd">
      {annotation.package}
      {" ["}
      <Link to={`https://pypi.python.org/pypi/${annotation.package}`} target="_blank">
        PyPI
      </Link>
      {"]"}
    </dd>,
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{annotation.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">{annotation.kind === "object" ? "type" : "function"}</dd>,
  ];
  if (annotation.name) { elements.push(
    <dt key="name-dt">Name</dt>,
    <dd key="name-dd">{annotation.name}</dd>,
  ); }
  if (annotation.description) { elements.push(
    <dt key="description-dt">Description</dt>,
    <dd key="description-dd" className="annotation-description">
      <ReactMarkdown source={annotation.description}/>
    </dd>,
  ); }
  return elements;
}

const PythonObjectDefList = (props: {annotation: Annotation.PythonObject}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  const slots = annotation.slots || [];
  return [
    <dt key="class-dt">Python class</dt>,
    <dd key="class-dd">
      <div className="annotation-class-list">
        <ul>{classes.map((className, i) =>
          <li key={i}>
            <code>{className}</code>
          </li>)}
        </ul>
      </div>
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
    <dt key="slots-dt">Slots</dt>,
    <dd key="slots-dd">
      <div className="slot-list">
        <ul>{slots.map((slot, i) =>
          <li key={i}>
            <code>{slot.slot}</code>
            {": "}
            <SExpComponent inline ontology sexp={slot.definition} />
          </li>)}
        </ul>
      </div>
    </dd>,
  ];
}

const PythonMorphismDefList = (props: {annotation: Annotation.PythonMorphism}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
  const elements: JSX.Element[] = [];
  if (annotation.function) { elements.push(
    <dt key="function-dt">Python function</dt>,
    <dd key="function-dd">
      <code>{annotation.function}</code>
    </dd>,
  ); }
  if (classes) { elements.push(
    <dt key="class-dt">Python class</dt>,
    <dd key="class-dd">
      <div className="annotation-class-list">
        <ul>{classes.map((className, i) =>
          <li key={i}>
            <code>{className}</code>
          </li>)}
        </ul>
      </div>
    </dd>,
  ); }
  if (annotation.method) { elements.push(
    <dt key="method-dt">Python method</dt>,
    <dd key="method-dd">
      <code>{annotation.method}</code>
    </dd>,
  ); }
  elements.push(
    <dt key="dom-dt">Input</dt>,
    <dd key="dom-dd">
      <div className="domain-list">
        <ol>{annotation.domain.map((ob, i) =>
          <li key={i}>
            <code>{ob.slot}</code>
          </li>)}
        </ol>
      </div>
    </dd>,
    <dt key="codom-dt">Output</dt>,
    <dd key="codom-dd">
      <div className="domain-list">
        <ol>{annotation.codomain.map((ob, i) =>
          <li key={i}>
            <code>{ob.slot}</code>
          </li>)}
        </ol>
      </div>
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
  );
  return elements;
}


const MorphismDiagram = (props: {doc: AnnotationCache}) => {
  const cache = props.doc;
  return <CytoscapeComponent cytoscape={{
    ...cache.definition.cytoscape,
    style: CytoscapeStyle as any,
    maxZoom: 2,
    autolock: true,
  }} height="600px" />
}
const MorphismDiagramCouchDB = displayCouchDocument(MorphismDiagram);
