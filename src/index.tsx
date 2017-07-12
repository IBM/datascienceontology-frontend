import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

interface IConceptName {
  ontology: string;
  id: string;
  name: string;
}

interface IAppProps {
  db: PouchDB.Database;
  ontology: string;
}
interface IAppState {
  concepts: Array<IConceptName>;
}

export class App extends React.Component<IAppProps,IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      concepts: []
    }
  }
  
  componentWillMount() {
    this.props.db.find({
      selector: {
        schema: "concept",
        ontology: this.props.ontology
      },
      fields: [ "ontology", "id", "name" ]
    }).then(result => {
      this.setState({concepts: result.docs as Array<any>});
    });
  }
  
  render() {
    return (
      <div className="concept-list">
        <ul>
          {this.state.concepts.map(concept =>
            <li key={concept.id}>{concept.name}</li>)}
        </ul>
      </div>
    );
  }
}

const db = new PouchDB("***REMOVED***/data-science-ontology");

ReactDOM.render(
  <App db={db} ontology="data-science" />,
  document.getElementById("main")
);
