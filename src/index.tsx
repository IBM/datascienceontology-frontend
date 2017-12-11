import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Alert, Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";

import { HomePage } from "./pages/home";
import { AnnotationPage } from "./pages/annotation";
import { ConceptPage } from "./pages/concept";
import { MarkdownPage } from "./pages/markdown";
import { SearchPage } from "./pages/search";

import "../style/main.css";
import "../style/bootstrap.css";


const App = () =>
  <div id="app">
    <Navbar>
      <NavbarBrand>
        <NavLink tag={Link} {...{to: "/"}}>
          Data Science Ontology
        </NavLink>
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink tag={Link} {...{to: "/search"}}>
            Search
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} {...{to: "/page/help"}}>
            Help
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} {...{to: "/page/about"}}>
            About
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/annotation/:language/:package/:id" component={AnnotationPage} />
      <Route path="/concept/:id" component={ConceptPage} />
      <Route path="/search/:query?" component={SearchPage} />
      <Route path="/page/:page" component={MarkdownPage} />
      <Route component={Error404Page} />
    </Switch>
  </div>;

const Error404Page = () =>
  <Alert color="danger">
    <h4>Whoops</h4>
    <p>The page you are looking for does not exist.</p>
  </Alert>;


ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById("react-container")
);
