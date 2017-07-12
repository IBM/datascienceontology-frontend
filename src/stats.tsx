import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";

interface IStatsProps {
  db: PouchDB.Database;
}
interface IStatsState {
  nconcepts: number;
}

export class SummaryStats extends React.Component<IStatsProps,IStatsState> {
  constructor(props: IStatsProps) {
    super(props);
    this.state = {
      nconcepts: 0
    }
  }
  
  componentWillMount() {
    this.props.db.query("query/schema_index", {
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
