import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Alert, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { HomePage } from "./pages/home";
import { AnnotationPage } from "./pages/annotation";
import { ConceptPage } from "./pages/concept";
import { SearchPage } from "./pages/search";

import "../style/main.css";


const App = () =>
  <div id="app">
    <Navbar>
      <Navbar.Header>
        <LinkContainer to="/" style={{ cursor: "pointer" }}>
          <Navbar.Brand>Data Science Ontology</Navbar.Brand>
        </LinkContainer>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/search">
          <NavItem>Search</NavItem>
        </LinkContainer>
        <LinkContainer to="/about">
          <NavItem>About</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/annotation/:language/:package/:id" component={AnnotationPage} />
      <Route path="/concept/:id" component={ConceptPage} />
      <Route path="/search/:query" component={SearchPage} />
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
