import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Button, Container, Row, Col } from "reactstrap";
import Client from "davenport";

import { Concept, Annotation } from "open-discovery";
import { ConceptResult, AnnotationResult } from "./search";
import * as Config from "../config";

import "../../style/pages/home.css";
import { faRandom } from "@fortawesome/fontawesome-free-solid";
import { SchemaGlyph } from "../components/glyphs";


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
            <Button color="primary" size="sm">Learn more</Button>
          </Router.Link>
        </p>
        {nconcepts && nannotations && <hr className="my-4"/>}
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
          <p>
            <h5 className="text-center">
              <SchemaGlyph schema="concept" />
              {" "}
              Concepts
            </h5>
          </p>
          <ul className="random-doc-list">
            <li><RandomConcept nconcepts={nconcepts}/></li>
            <li><RandomConcept nconcepts={nconcepts}/></li>
            <li><RandomConcept nconcepts={nconcepts}/></li>
          </ul>
        </Col>
        <Col md>
          <p>
            <h5 className="text-center">
              <SchemaGlyph schema="annotation" />
              {" "}
              Annotations
            </h5>
          </p>
          <ul className="random-doc-list">
            <li><RandomAnnotation nannotations={nannotations}/></li>
            <li><RandomAnnotation nannotations={nannotations}/></li>
            <li><RandomAnnotation nannotations={nannotations}/></li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}


interface RandomDocProps {
  schema: "concept" | "annotation";
  ndocs: number;
}
interface RandomDocState {
  doc: Concept.Concept | Annotation.Annotation;
}

export class RandomDoc extends React.Component<RandomDocProps, RandomDocState> {
  constructor(props: RandomDocProps) {
    super(props);
    this.state = { doc: null };
  }

  componentWillMount() {
    this.loadRandomDocument(this.props);
  }
  componentWillReceiveProps(nextProps: RandomDocProps) {
    if (nextProps.ndocs != this.props.ndocs) {
     this.loadRandomDocument(nextProps);
    }
  }

  loadRandomDocument(props: RandomDocProps) {
    if (!props.ndocs) {
      this.setState({ doc: null });
      return;
    }
    const client = new Client<any>(Config.db_origin, Config.db_name);
    client.find({
      selector: {
        schema: props.schema,
      },
      fields: [
        "schema",
        "package",
        "language",
        "id", 
        "name",
        "description",
        "kind",
      ],
      limit: 1,
      skip: _.random(props.ndocs),
    }).then(docs => {
      this.setState({ doc: docs[0] });
    });
  }

  render() {
    const { doc } = this.state;
    if (doc && doc.schema === "concept")
      return <ConceptResult concept={doc as Concept.Concept} />;
    if (doc && doc.schema === "annotation")
      return <AnnotationResult annotation={doc as Annotation.Annotation} />;
    return null;
  }
}

const RandomConcept = (props: {nconcepts: number}) =>
  <RandomDoc schema="concept" ndocs={props.nconcepts} />;

const RandomAnnotation = (props: {nannotations: number}) =>
  <RandomDoc schema="annotation" ndocs={props.nannotations} />;
