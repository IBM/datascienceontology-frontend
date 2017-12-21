import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import * as ReactMarkdown from "react-markdown";
import { Container, Row, Col } from "reactstrap";
import FontAwesome = require("react-fontawesome");

import { Annotation } from "open-discovery";
import { CytoscapeComponent, Link, displayCouchDocument }
  from "open-discovery-components";
import { SExpComponent } from "../components/sexp";
import { AnnotationCache } from "../interfaces/annotation_cache";
import * as Config from "../config";

import "../../style/pages/annotation.css";
import * as CytoscapeStyle from "../../style/pages/annotation.cytoscape.json";


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
          <FontAwesome name="pencil" />
          {" "}
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      <AnnotationContent annotation={annotation} />
    </section>
  );
}
const AnnotationDisplayCouchDB = displayCouchDocument(AnnotationDisplay);


const AnnotationContent = (props: {annotation: Annotation.Annotation}) => {
  const annotation = props.annotation;
  if (Annotation.isObject(annotation)) {
    return (
      <dl className="dl-horizontal">
        {BaseDefList({ annotation })}
        {ObjectDefList({ annotation })}
      </dl>
    );
  } else if (Annotation.isMorphism(annotation)) {
    const cacheId = `annotation/${annotation.language}/${annotation.package}/${annotation.id}`;
    return (
      <Container>
        <Row>
          <Col>
            <dl className="dl-horizontal">
              {BaseDefList({ annotation })}
              {MorphismDefList({ annotation })}
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

const BaseDefList = (props: {annotation: Annotation.Annotation}) => {
  const annotation = props.annotation;
  const packageLink = PackageRepositoryLink({annotation});
  const elements = [
    <dt key="language-dt">Language</dt>,
    <dd key="language-dd">
      {annotation.language}
      {" "}
      <img src={`/assets/images/logo-${annotation.language}.svg`} 
           width="24" height="24" />
    </dd>,
    <dt key="package-dt">Package</dt>,
    <dd key="package-dd">
      {annotation.package}
      {packageLink && " ["}
      {packageLink}
      {packageLink && "]"}
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

const ObjectDefList = (props: {annotation: Annotation.ObjectAnnotation}) => {
  const annotation = props.annotation;
  if (Annotation.isPythonObject(annotation)) {
    return PythonObjectDefList({annotation});
  } else if (Annotation.isRObject(annotation)) {
    return RObjectDefList({annotation});
  }
  return [];
}

const MorphismDefList = (props: {annotation: Annotation.MorphismAnnotation}) => {
  const annotation = props.annotation;
  if (Annotation.isPythonMorphism(annotation)) {
    return PythonMorphismDefList({annotation});
  } else if (Annotation.isRMorphism(annotation)) {
    return RMorphismDefList({annotation});
  }
  return [];
}


const PythonObjectDefList = (props: {annotation: Annotation.PythonObject}) => {
  const annotation = props.annotation;
  const classes = typeof annotation.class === "string" ?
    [ annotation.class ] : annotation.class;
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
      <SlotList slots={annotation.slots || []} />
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
      <DomainObjectList objects={annotation.domain} />
    </dd>,
    <dt key="codom-dt">Output</dt>,
    <dd key="codom-dd">
      <DomainObjectList objects={annotation.codomain} />
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
  );
  return elements;
}


const RObjectDefList = (props: {annotation: Annotation.RObject}) => {
  const annotation = props.annotation;
  const slots = annotation.slots || [];
  return [
    <dt key="class-dt">{annotation.system} class</dt>,
    <dd key="class-dd">
      <code>{annotation.class}</code>
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
    <dt key="slots-dt">Slots</dt>,
    <dd key="slots-dd">
      <SlotList slots={annotation.slots || []} />
    </dd>,
  ];
}

const RMorphismDefList = (props: {annotation: Annotation.RMorphism}) => {
  const annotation = props.annotation;
  const elements: JSX.Element[] = [];
  if (annotation.function) { elements.push(
    <dt key="function-dt">R function</dt>,
    <dd key="function-dd">
      <code>{annotation.function}</code>
    </dd>,
  ); }
  if (annotation.method) { elements.push(
    <dt key="class-dt">{annotation.system} class</dt>,
    <dd key="class-dd">
      <code>{annotation.class}</code>
    </dd>,
    <dt key="method-dt">R method</dt>,
    <dd key="method-dd">
      <code>{annotation.method}</code>
    </dd>,
  ); }
  elements.push(
    <dt key="dom-dt">Input</dt>,
    <dd key="dom-dd">
      <DomainObjectList objects={annotation.domain} />
    </dd>,
    <dt key="codom-dt">Output</dt>,
    <dd key="codom-dd">
      <DomainObjectList objects={annotation.codomain} />
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
  );
  return elements;
}


const DomainObjectList = (props: {objects: Annotation.DomainObject[]}) =>
  <div className="annotation-domain-list">
    <ol>{props.objects.map((ob, i) =>
      <li key={i}>
        <code>{ob.slot}</code>
      </li>)}
    </ol>
  </div>;

const SlotList = (props: {slots: Annotation.Slot[]}) =>
  <div className="annotation-slot-list">
    <ul>{props.slots.map((slot, i) =>
      <li key={i}>
        <code>{slot.slot}</code>
        {": "}
        <SExpComponent inline ontology sexp={slot.definition} />
      </li>)}
    </ul>
  </div>;

const PackageRepositoryLink = (props: {annotation: Annotation.Annotation}) => {
  const annotation = props.annotation;
  const pkg = annotation.package;
  if (Annotation.isPython(annotation) && pkg != "builtins") {
    return (
      <Link to={`https://pypi.python.org/pypi/${pkg}`} target="_blank">
        PyPI
      </Link>
    );
  } else if (Annotation.isR(annotation) && rStdLib.indexOf(pkg) == -1) {
    return (
      <Link to={`https://cran.r-project.org/package=${pkg}`} target="_blank">
        CRAN
      </Link>
    );
  }
  return null;
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


/** List of packages in r-base (the R standard library).

  <https://github.com/wch/r-source/tree/trunk/src/library>
 */
const rStdLib = [
  "base",
  "compiler",
  "datasets",
  "grDevices",
  "graphics",
  "grid",
  "methods",
  "parallel",
  "profile",
  "splines",
  "stats",
  "stats4",
  "tcltk",
  "tools",
  "translations",
  "utils",
];
