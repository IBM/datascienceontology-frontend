import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Button, Card, CardTitle, Container, Row, Col } from "reactstrap";
import Client from "davenport";

import { Concept, Annotation } from "open-discovery";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import * as Config from "../config";

import "../../style/pages/home.css";


interface HomePageState {
  nconcepts: number;
  nannotations: number;
}

export class HomePage extends React.Component<{},HomePageState> {
  constructor() {
    super();
    this.state = {
      nconcepts: 0,
      nannotations: 0,
    };
  }

  componentWillMount() {
    const client = new Client(Config.db_origin, Config.db_name);
    client.view<number>("query", "schema_index", {
      group: true,
      reduce: true,
    }).then(result => {
      const getCount = (schema: string) =>
        result.rows.find(row => row.key[0] === schema).value;
      this.setState({
        nconcepts: getCount("concept"),
        nannotations: getCount("annotation"),
      });
    });
  }
  
  render() {
    const { nannotations, nconcepts } = this.state;
    return (
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
          <Router.Link to="/page/help">
            <Button color="secondary" size="sm">Learn more</Button>
          </Router.Link>
        </p>
        {nconcepts && nannotations &&
          <RandomDocs nconcepts={nconcepts} nannotations={nannotations} />}
      </section>
    );
  }
}


interface RandomDocsProps {
  nconcepts: number;
  nannotations: number;
}

const RandomDocs = (props: RandomDocsProps) => {
  const { nconcepts, nannotations } = props;
  return (
    <Container>
      <Row>
        <Col md>
          <h4 className="text-center">
            <SchemaGlyph schema="concept" />
            {" "}
            Concepts
          </h4>
          <p>Concepts formalize the abstract ideas of data science.</p>
          <Card body className="random-card">
            <CardTitle>Concept</CardTitle>
            <RandomConcept nconcepts={nconcepts} />
          </Card>
        </Col>
        <Col md>
          <h4 className="text-center">
            <SchemaGlyph schema="annotation" />
            {" "}
            Annotations
          </h4>
          <p>Annotations translate data science code into concepts.</p>
          <Card body className="random-card">
            <CardTitle>Annotation</CardTitle>
            <RandomAnnotation nannotations={nannotations} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


interface RandomConceptProps {
  nconcepts: number;
}
interface RandomConceptState {
  concept: Concept.Concept;
}

export class RandomConcept extends React.Component<RandomConceptProps, RandomConceptState> {
  componentWillMount() {
    this.loadRandomConcept(this.props);
  }
  componentWillReceiveProps(nextProps: RandomConceptProps) {
    if (nextProps.nconcepts != this.props.nconcepts) {
     this.loadRandomConcept(nextProps);
    }
  }

  loadRandomConcept(props: RandomConceptProps) {
    if (!props.nconcepts) {
      this.setState({ concept: null });
      return;
    }
    const client = new Client<Concept.Concept>(Config.db_origin, Config.db_name);
    client.find({
      selector: { schema: "concept" },
      fields: [ "id", "name", "description", "kind" ],
      limit: 1,
      skip: _.random(props.nconcepts),
    }).then(concepts => {
      this.setState({ concept: concepts[0] });
    });
  }

  render() {
    const concept = this.state && this.state.concept;
    if (!concept) {
      return null;
    }
    return (
      <dl>
        <dt>Name</dt>
        <dd>
          <Router.Link to={`/concept/${concept.id}`}>
            {concept.name}
          </Router.Link>
          {" "}
          <span className="text-muted text-nowrap">({concept.id})</span>
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
}


interface RandomAnnotationProps {
  nannotations: number;
}
interface RandomAnnotationState {
  annotation: Annotation.Annotation;
}

export class RandomAnnotation extends React.Component<RandomAnnotationProps, RandomAnnotationState> {
  componentWillMount() {
    this.loadRandomAnnotation(this.props);
  }
  componentWillReceiveProps(nextProps: RandomAnnotationProps) {
    if (nextProps.nannotations != this.props.nannotations) {
     this.loadRandomAnnotation(nextProps);
    }
  }

  loadRandomAnnotation(props: RandomAnnotationProps) {
    if (!props.nannotations) {
      this.setState({ annotation: null });
      return;
    }
    const client = new Client<Annotation.Annotation>(Config.db_origin, Config.db_name);
    client.find({
      selector: { schema: "annotation" },
      fields: [ "language", "package", "id", "name", "description", "kind" ],
      limit: 1,
      skip: _.random(props.nannotations),
    }).then(annotations => {
      this.setState({ annotation: annotations[0] });
    });
  }

  render() {
    const note = this.state && this.state.annotation;
    if (!note) {
      return null;
    }
    const key = `${note.language}/${note.package}/${note.id}`;
    return (
      <dl>
        <dt>Name</dt>
        <dd>
          <Router.Link to={`/annotation/${key}`}>
            {note.name !== undefined ? note.name : note.id}
          </Router.Link>
          {" "}
          <span className="text-muted text-nowrap">({key})</span>
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
}
