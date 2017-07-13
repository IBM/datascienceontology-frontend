import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";

import * as Services from "../services";
import { OntologySearchBar } from "./search";

export const HomePage = () => 
  <section className="home">
    <h1>Data Science Ontology</h1>
    <OntologySearchBar/>
    <Welcome/>
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
          <p>Welcome to the Data Science Ontology, containing {nconcepts} data science concepts</p> :
          <p>Welcome to the Data Science Ontology</p>}
        <p>Search for concepts and annotations or learn more</p>
      </section>
    )
  }
}
