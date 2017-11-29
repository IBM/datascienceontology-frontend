import * as React from "react";
import * as Router from "react-router-dom";
import { Grid, Col, Jumbotron } from "react-bootstrap";
import Client from "davenport";

import * as Config from "../config";
import { OntologySearchBar } from "./search";


export const HomePage = () => 
  <section className="home">
    <Grid>
      <Col sm={8} smOffset={2}>
        <Jumbotron>
          <Welcome/>
          <OntologySearchBar/>
        </Jumbotron>
        <p>
          The Data Science Ontology is an knowledge base about data science
          with a focus on computer programming for data analysis.
          {" "}
          <Router.Link to="/page/help">Learn more</Router.Link>
        </p>
       </Col>
    </Grid>
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
      <section className="welcome">
        {nannotations && nconcepts ?
          <p>Welcome to the Data Science Ontology,
            with {nconcepts} data science concepts
            and {nannotations} code annotations</p> :
          <p>Welcome to the Data Science Ontology</p>}
      </section>
    )
  }
}
