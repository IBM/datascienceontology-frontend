import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Alert, PageHeader } from "react-bootstrap";

import { HomePage } from "./pages/home";
import { ConceptPage } from "./pages/concept";
import { SearchPage } from "./pages/search";
import { DiagramPage } from "./pages/diagram";

import "../style/main.css";


const App = () =>
  <div id="app">
    <PageHeader><Link to="/">Data Science Ontology</Link></PageHeader>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/concept/:id" component={ConceptPage} />
      <Route path="/search/:query" component={SearchPage} />
      <Route path="/diagram" component={DiagramPage} />
      <Route component={Error404Page} />
    </Switch>
  </div>;

const Error404Page = () =>
  <Alert bsStyle="danger">
    <h4>Whoops</h4>
    <p>The page you are looking for does not exist.</p>
  </Alert>;


ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById("react-container")
);
