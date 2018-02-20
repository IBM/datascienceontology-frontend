import * as React from "react";
import * as Router from "react-router-dom";
import { Button, Jumbotron } from "reactstrap";
import Client from "davenport";

import * as Config from "../config";
import { OntologySearchBar } from "./search";

import "../../style/pages/home.css";


export const HomePage = () => 
  <section id="home">
    <Jumbotron>
      <h1 className="display-4">Data Science Ontology</h1>
      <Welcome/>
      <p><OntologySearchBar/></p>
      <p>
        The Data Science Ontology is an knowledge base about data science
        with a focus on computer programming for data analysis.
      </p>
      <p>
        <Router.Link to="/page/help">
          <Button color="primary" size="sm">Learn more</Button>
        </Router.Link>
      </p>
    </Jumbotron>
  </section>


interface IWelcomeState {
  nannotations: number;
  nconcepts: number;
}

export class Welcome extends React.Component<{},IWelcomeState> {
  constructor() {
    super();
    this.state = {
      nannotations: 0,
      nconcepts: 0
    }
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
        nannotations: getCount("annotation"),
        nconcepts: getCount("concept")
      });
    });
  }
  
  render() {
    const { nannotations, nconcepts } = this.state;
    return (
      <p className="lead">
        {nannotations && nconcepts ?
        `Welcome to the Data Science Ontology,
         with ${nconcepts} data science concepts
         and ${nannotations} code annotations` :
        'Welcome to the Data Science Ontology'}
      </p>
    );
  }
}
