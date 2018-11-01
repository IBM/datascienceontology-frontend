import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import * as ReactMarkdown from "react-markdown";
import { Container, Row, Col } from "reactstrap";

import * as Annotation from "../interfaces/annotation";
import { AnnotationCache } from "../interfaces/annotation_cache";
import { CytoscapeComponent} from "../components/cytoscape";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import { displayResponseData } from "../components/higher-order";
import { Link } from "../components/link";
import { SExpComponent } from "../components/sexp";

import { apiUrl } from "../config";

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
  const endpoint = `annotation/${key.language}/${key.package}/${key.id}`;
  return <AnnotationRequest url={`${apiUrl}/${endpoint}`} />;
}

export const AnnotationDisplay = (props: {data?: Annotation.Annotation}) => {
  const annotation = props.data;
  return annotation && (
    <section id="annotation">
      <h3>
        <span className="text-muted" style={{paddingRight: "2em"}}>
          <SchemaGlyph schema="annotation" />
          {" "}
          Annotation
        </span>
        {annotation.name || annotation.id}
      </h3>
      <AnnotationContent annotation={annotation} />
    </section>
  );
}
const AnnotationRequest = displayResponseData(AnnotationDisplay);


const AnnotationContent = (props: {annotation: Annotation.Annotation}) => {
  const annotation = props.annotation;
  if (Annotation.isType(annotation)) {
    return (
      <dl className="dl-horizontal">
        {BaseDefList({ annotation })}
        {TypeDefList({ annotation })}
      </dl>
    );
  } else if (Annotation.isFunction(annotation)) {
    const cacheId = `annotation/${annotation.language}/${annotation.package}/${annotation.id}`;
    return (
      <Container fluid>
        <Row>
          <Col>
            <dl className="dl-horizontal">
              {BaseDefList({ annotation })}
              {FunctionDefList({ annotation })}
            </dl>
          </Col>
          <Col>
            <FunctionDiagramRequest url={`${apiUrl}/_cache/${cacheId}`} />
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
      <LanguageGlyph language={annotation.language} />
      {" "}
      {_.capitalize(annotation.language)}
    </dd>,
    <dt key="package-dt">Package</dt>,
    <dd key="package-dd">
      {annotation.package}
      {packageLink && " ("}
      {packageLink}
      {packageLink && ")"}
    </dd>,
    <dt key="id-dt">ID</dt>,
    <dd key="id-dd">{annotation.id}</dd>,
    <dt key="kind-dt">Kind</dt>,
    <dd key="kind-dd">
      <KindGlyph kind={annotation.kind} />
      {" "}
      {annotation.kind}
    </dd>,
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

const TypeDefList = (props: {annotation: Annotation.TypeAnnotation}) => {
  const annotation = props.annotation;
  if (Annotation.isPythonType(annotation)) {
    return PythonTypeDefList({annotation});
  } else if (Annotation.isRType(annotation)) {
    return RTypeDefList({annotation});
  }
  return [];
}

const FunctionDefList = (props: {annotation: Annotation.FunctionAnnotation}) => {
  const annotation = props.annotation;
  if (Annotation.isPythonFunction(annotation)) {
    return PythonFunctionDefList({annotation});
  } else if (Annotation.isRFunction(annotation)) {
    return RFunctionDefList({annotation});
  }
  return [];
}


const PythonTypeDefList = (props: {annotation: Annotation.PythonType}) => {
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

const PythonFunctionDefList = (props: {annotation: Annotation.PythonFunction}) => {
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
    <dt key="dom-dt">Inputs</dt>,
    <dd key="dom-dd">
      <PortAnnotationList ports={annotation.inputs} />
    </dd>,
    <dt key="codom-dt">Outputs</dt>,
    <dd key="codom-dd">
      <PortAnnotationList ports={annotation.outputs} />
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
  );
  return elements;
}


const RTypeDefList = (props: {annotation: Annotation.RType}) => {
  const annotation = props.annotation;
  const slots = annotation.slots || [];
  return [
    <dt key="class-dt">{annotation.system || "S3"} class</dt>,
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

const RFunctionDefList = (props: {annotation: Annotation.RFunction}) => {
  const annotation = props.annotation;
  const elements: JSX.Element[] = [
    <dt key="function-dt">R function</dt>,
    <dd key="function-dd">
      <code>{annotation.function}</code>
    </dd>,
  ];
  if (annotation.class) { elements.push(
    <dt key="class-dt">{annotation.system || "S3"} method of</dt>,
    <dd key="class-dd">
      <code>{annotation.class}</code>
    </dd>,
  ); }
  elements.push(
    <dt key="dom-dt">Inputs</dt>,
    <dd key="dom-dd">
      <PortAnnotationList ports={annotation.inputs} />
    </dd>,
    <dt key="codom-dt">Outputs</dt>,
    <dd key="codom-dd">
      <PortAnnotationList ports={annotation.outputs} />
    </dd>,
    <dt key="def-dt">Definition</dt>,
    <dd key="def-dd">
      <SExpComponent inline ontology sexp={annotation.definition} />
    </dd>,
  );
  return elements;
}


const PortAnnotationList = (props: {ports: Annotation.PortAnnotation[]}) =>
  <div className="annotation-port-list">
    <ol>{props.ports.map((port, i) =>
      <li key={i}>
        <code>{port.slot}</code>
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
      <Link to={`https://pypi.org/project/${pkg}`} target="_blank">
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

const FunctionDiagram = (props: {data?: AnnotationCache}) => {
  const cache = props.data;
  return cache && (
    <CytoscapeComponent height="600px" cytoscape={{
      ...cache.definition.cytoscape,
      style: CytoscapeStyle as any,
      maxZoom: 2,
      autolock: true,
    }} />
  );
}
const FunctionDiagramRequest = displayResponseData(FunctionDiagram);


export const AnnotationFullName = (props: {annotation: Annotation.Annotation}) => {
  const note = props.annotation;
  const key = `${note.language}/${note.package}/${note.id}`;
  return <span>
    <Router.Link to={`/annotation/${key}`}>
      {note.name !== undefined ? note.name : note.id}
    </Router.Link>
    {" "}
    <span className="text-muted text-nowrap">
      ({key})
    </span>
  </span>;
}


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
