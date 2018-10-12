import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Button, Card, CardTitle, Container, Row, Col } from "reactstrap";

import { Concept, Annotation } from "open-discovery";
import { displayResponseData } from "open-discovery-components";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import { AnnotationFullName } from "./annotation";
import { ConceptFullName } from "./concept";
import { apiUrl } from "../config";

import "../../style/pages/home.css";


export const HomePage = () =>
  <HomePageRequest url={`${apiUrl}/count`} />;


interface HomePageProps {
  concept?: number;
  annotation?: number;
}

const HomePageDisplay = (props: {data?: HomePageProps}) => {
  const counts = props.data || {};
  const nconcepts = counts.concept || 0
  const nannotations = counts.annotation || 0;
  return <Container>
    <section id="home">
      <h1 className="display-4 text-center">
        Data Science Ontology
      </h1>
      <p className="lead">
        {nannotations && nconcepts ?
        `Welcome to the Data Science Ontology, with
          ${nconcepts} data science concepts and 
          ${nannotations} code annotations` :
        'Welcome to the Data Science Ontology'}
      </p>
      <p>
        The Data Science Ontology is a knowledge base about data science that
        aims to
        <ul>
          <li> catalog the <strong>concepts</strong> of data science </li>
          <li> semantically <strong>annotate</strong> popular software packages
            for data science </li>
          <li> power new <strong>AI</strong> assistants
            for data scientists </li>
        </ul>
      </p>
      <p>
        <Router.Link to="/browse">
          <Button color="primary" size="sm" className="mr-2">
            Browse
          </Button>
        </Router.Link>
        <Router.Link to="/help">
          <Button color="secondary" size="sm" className="mr-2">
            Learn more
          </Button>
        </Router.Link>
        <Router.Link to="/help/contribute">
          <Button color="secondary" size="sm">
            Contribute
          </Button>
        </Router.Link>
      </p>
      <RandomDocs/>
    </section>
  </Container>;
}
const HomePageRequest = displayResponseData(HomePageDisplay);


const RandomDocs = () =>
  <Container fluid>
    <Row>
      <Col md>
        <h4 className="text-center">
          <SchemaGlyph schema="concept" />
          {" "}
          Concepts
        </h4>
        <p>Concepts formalize the abstract ideas of data science.</p>
        <Card body className="random-card mb-3">
          <CardTitle>Concept</CardTitle>
          <RandomConceptRequest url={`${apiUrl}/concept/_random`} />
        </Card>
      </Col>
      <Col md>
        <h4 className="text-center">
          <SchemaGlyph schema="annotation" />
          {" "}
          Annotations
        </h4>
        <p>Annotations translate data science code into concepts.</p>
        <Card body className="random-card mb-3">
          <CardTitle>Annotation</CardTitle>
          <RandomAnnotationRequest url={`${apiUrl}/annotation/_random`} />
        </Card>
      </Col>
    </Row>
  </Container>;


const RandomConceptDisplay = (props: {data?: Concept.Concept}) => {
  const concept = props.data;
  return concept && (
    <dl>
      <dt>Name</dt>
      <dd>
        <ConceptFullName concept={concept} />
      </dd>
      <dt>Kind</dt>
      <dd>
        <KindGlyph kind={concept.kind} />
        {" "}
        {concept.kind === "object" ? "type" : "function"}
      </dd>
      {concept.description && <dt>Description</dt>}
      {concept.description && <dd>{concept.description}</dd>}
    </dl>
  );
}
const RandomConceptRequest = displayResponseData(RandomConceptDisplay);


const RandomAnnotationDisplay = (props: {data?: Annotation.Annotation}) => {
  const note = props.data;
  return note && (
    <dl>
      <dt>Name</dt>
      <dd>
        <AnnotationFullName annotation={note} />
      </dd>
      <dt>Kind</dt>
      <dd>
        <KindGlyph kind={note.kind} />
        {" "}
        {note.kind === "object" ? "type" : "function"}
      </dd>
      <dt>Language</dt>
      <dd>
        <LanguageGlyph language={note.language} />
        {" "}
        {_.capitalize(note.language)}
      </dd>
      <dt>Package</dt>
      <dd>{note.package}</dd>
      {note.description && <dt>Description</dt>}
      {note.description && <dd>{note.description}</dd>}
    </dl>
  );
}
const RandomAnnotationRequest = displayResponseData(RandomAnnotationDisplay);
