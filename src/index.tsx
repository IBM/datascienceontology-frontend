import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PouchDB from "pouchdb";

import { SearchBar } from "./search";
import { SummaryStats } from "./stats";

interface IAppProps {
  db: PouchDB.Database;
}

const App = (props: IAppProps) =>
 <div>
  <SearchBar placeholder="Search the ontology"/>
  <SummaryStats db={props.db}/>
 </div>;

const db = new PouchDB("***REMOVED***/data-science-ontology");

ReactDOM.render(
  <App db={db} />,
  document.getElementById("main")
);
