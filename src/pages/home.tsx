import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";

import * as Common from "../common";
import { OntologySearchBar } from "./search";

export const HomePage = () => 
  <section className="home">
    <h1>Data Science Ontology</h1>
    <OntologySearchBar/>
    <SummaryStats/>
  </section>


interface IStatsState {
  nconcepts: number;
}

export class SummaryStats extends React.Component<{},IStatsState> {
  constructor() {
    super();
    this.state = {
      nconcepts: 0
    }
  }
  
  componentWillMount() {
    Common.db.query("query/schema_index", {
      group: true
    }).then(result => {
      this.setState({
        nconcepts: result.rows.find(row => row.key[0] === "concept").value});
    });
  }
  
  render() {
    if (!this.state.nconcepts) {
      return null;
    }
    return (
      <span>{this.state.nconcepts} concepts</span>
    );
  }
}
