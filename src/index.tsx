import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

interface IAppProps {
  db: PouchDB.Database;
  ontology: string;
}
interface IAppState {
  nconcepts: number;
}

export class App extends React.Component<IAppProps,IAppState> {
  constructor(props: IAppProps) {
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
    return (
      <p>{this.state.nconcepts} concepts</p>
    );
  }
}

const db = new PouchDB("***REMOVED***/data-science-ontology");

ReactDOM.render(
  <App db={db} ontology="data-science" />,
  document.getElementById("main")
);
