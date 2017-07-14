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
  nconcepts: number;
}

export class Welcome extends React.Component<{},IWelcomeState> {
  constructor() {
    super();
    this.state = {
      nconcepts: 0
    }
  }
  
  componentWillMount() {
    Services.db.query("query/schema_index", {
      group: true
    }).then(result => {
      this.setState({
        nconcepts: result.rows.find(row => row.key[0] === "concept").value});
    });
  }
  
  render() {
    const { nconcepts } = this.state;
    return (
      <section className="welcome">
        {nconcepts ? 
          <p>Welcome to the Data Science Ontology, with {nconcepts} data science concepts</p> :
          <p>Welcome to the Data Science Ontology</p>}
      </section>
    )
  }
}
