import * as React from "react";
import { Grid, Col, Button, Jumbotron } from "react-bootstrap";

import * as Services from "../services";
import { OntologySearchBar } from "./search";


export const HomePage = () => 
  <section className="home">
    <Grid>
      <Col sm={8} smOffset={2}>
        <Jumbotron>
          <Welcome/>
          <OntologySearchBar/>
          <Button bsStyle="primary">Learn more</Button>
        </Jumbotron>
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
    Services.db.query("query/schema_index", {
      group: true
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
          <p>Welcome to the Data Science Ontology, with {nconcepts} data science concepts and {nannotations} code annotations</p> :
          <p>Welcome to the Data Science Ontology</p>}
      </section>
    )
  }
}
