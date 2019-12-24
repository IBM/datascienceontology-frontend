import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Button,
  Card,
  Content,
  Columns,
  Heading
} from "react-bulma-components";

import * as Concept from "../interfaces/concept";
import * as Annotation from "../interfaces/annotation";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import { displayResponseData } from "../components/higher-order";
import { AnnotationFullName } from "./annotation";
import { ConceptFullName } from "./concept";
import { apiUrl } from "../config";

export const HomePage = () => <HomePageRequest url={`${apiUrl}/count`} />;

interface HomePageProps {
  concept?: number;
  annotation?: number;
}

const HomePageDisplay = (props: { data?: HomePageProps }) => {
  const counts = props.data || {};
  const nconcepts = counts.concept || 0;
  const nannotations = counts.annotation || 0;
  return (
    <section id="home">
      <Heading size={1} textAlignment="centered">
        Data Science Ontology
      </Heading>
      <Content textSize={5}>
        {nannotations && nconcepts
          ? `Welcome to the Data Science Ontology, with
          ${nconcepts} data science concepts and 
          ${nannotations} code annotations`
          : "Welcome to the Data Science Ontology"}
      </Content>
      <Content>
        The Data Science Ontology is a knowledge base about data science that
        aims to
        <ul>
          <li>
            {" "}
            catalog the <strong>concepts</strong> of data science{" "}
          </li>
          <li>
            {" "}
            semantically <strong>annotate</strong> popular software packages for
            data science{" "}
          </li>
          <li>
            {" "}
            power new <strong>AI</strong> assistants for data scientists{" "}
          </li>
        </ul>
      </Content>
      <Button.Group>
        <Button color="primary" renderAs={Router.Link} {...{ to: "/browse" }}>
          Browse
        </Button>
        <Button color="info" renderAs={Router.Link} {...{ to: "/help" }}>
          Learn more
        </Button>
        <Button
          color="info"
          renderAs={Router.Link}
          {...{ to: "/help/contribute" }}
        >
          Contribute
        </Button>
      </Button.Group>
      <RandomDocs />
    </section>
  );
};
const HomePageRequest = displayResponseData(HomePageDisplay);

const RandomDocs = () => (
  <Columns>
    <Columns.Column>
      <Heading size={4} textAlignment="centered">
        <SchemaGlyph schema="concept" /> Concepts
      </Heading>
      <Content>Concepts formalize the abstract ideas of data science.</Content>
      <Card>
        <Card.Header>
          <Card.Header.Title>Sample concept</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <RandomConceptRequest url={`${apiUrl}/concept/_random`} />
        </Card.Content>
      </Card>
    </Columns.Column>
    <Columns.Column>
      <Heading size={4} textAlignment="centered">
        <SchemaGlyph schema="annotation" /> Annotations
      </Heading>
      <Content>Annotations translate data science code into concepts</Content>
      <Card>
        <Card.Header>
          <Card.Header.Title>Sample annotation</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <RandomAnnotationRequest url={`${apiUrl}/annotation/_random`} />
        </Card.Content>
      </Card>
    </Columns.Column>
  </Columns>
);

const RandomConceptDisplay = (props: { data?: Concept.Concept }) => {
  const concept = props.data;
  return concept ? (
    <dl className="dl-inline">
      <dt>Name</dt>
      <dd>
        <ConceptFullName concept={concept} />
      </dd>
      <dt>Kind</dt>
      <dd>
        <KindGlyph kind={concept.kind} /> {concept.kind}
      </dd>
      {concept.description && <dt>Description</dt>}
      {concept.description && (
        <dd>
          <ReactMarkdown
            source={concept.description}
            renderers={{ paragraph: "span" }}
          />
        </dd>
      )}
    </dl>
  ) : (
    <></>
  );
};
const RandomConceptRequest = displayResponseData(RandomConceptDisplay);

const RandomAnnotationDisplay = (props: { data?: Annotation.Annotation }) => {
  const note = props.data;
  return note ? (
    <dl className="dl-inline">
      <dt>Name</dt>
      <dd>
        <AnnotationFullName annotation={note} />
      </dd>
      <dt>Kind</dt>
      <dd>
        <KindGlyph kind={note.kind} /> {note.kind}
      </dd>
      <dt>Language</dt>
      <dd>
        <LanguageGlyph language={note.language} /> {_.capitalize(note.language)}
      </dd>
      <dt>Package</dt>
      <dd>{note.package}</dd>
      {note.description && <dt>Description</dt>}
      {note.description && (
        <dd>
          <ReactMarkdown
            source={note.description}
            renderers={{ paragraph: "span" }}
          />
        </dd>
      )}
    </dl>
  ) : (
    <></>
  );
};
const RandomAnnotationRequest = displayResponseData(RandomAnnotationDisplay);
