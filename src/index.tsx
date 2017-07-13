import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Router from "react-router-dom";
import { PageHeader } from "react-bootstrap";

import { HomePage } from "./pages/home";
import { SearchPage } from "./pages/search";


const App = () =>
  <div className="main">
    <PageHeader>Data Science Ontology</PageHeader>
    <Router.Route exact path="/" component={HomePage} />
    <Router.Route path="/search/:query" component={SearchPage} />
  </div>;

ReactDOM.render(
  <Router.BrowserRouter>
    <App/>
  </Router.BrowserRouter>,
  document.getElementById("react-container")
);
