import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, RouteComponentProps, Switch, Link, NavLink }
  from "react-router-dom";
import { Button, Form, Message, Navbar, } from "react-bulma-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { HomePage } from "./pages/home";
import { AnnotationPage } from "./pages/annotation";
import { AnnotationIndexPage } from "./pages/annotation_index";
import { ConceptPage } from "./pages/concept";
import { ConceptIndexPage } from "./pages/concept_index";
import { MarkdownPage, MarkdownDisplay } from "./pages/markdown";
import { SearchPage } from "./pages/search";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "../style/main.css";
import "../style/bootstrap.css";


const App = () =>
  <div id="app">
    <Navbar color="dark">
      <Navbar.Brand>
        <Navbar.Item renderAs={Link} {...{to: "/"}} textSize={5}>
          Data Science Ontology
        </Navbar.Item>
      </Navbar.Brand>
      <Navbar.Container>
        <Navbar.Item renderAs="div">
          <Switch>
            <Route path="/search/:query?" component={SearchBar} />
            <Route component={SearchBar} />
          </Switch>
        </Navbar.Item>
      </Navbar.Container>
      <Navbar.Container position="end">
        <NavbarLink to="/browse">
          Browse
        </NavbarLink>
        <NavbarLink to="/help">
          Help
        </NavbarLink>
        <NavbarLink to="/about">
          About
        </NavbarLink>
      </Navbar.Container>
    </Navbar>
    <main>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/annotation/:language/:package/:id" component={AnnotationPage} />
        <Route path="/concept/:id" component={ConceptPage} />
        <Route exact path="/browse" component={() => <MarkdownDisplay page="browse"/>} />
        <Route exact path="/browse/annotations" component={AnnotationIndexPage} />
        <Route exact path="/browse/concepts" component={ConceptIndexPage} />
        <Route path="/search/:query?" component={SearchPage} />
        <Route exact path="/about" component={() => <MarkdownDisplay page="about"/>} />
        <Route exact path="/help" component={() => <MarkdownDisplay page="help"/>} />
        <Route path="/help/:page" component={MarkdownPage} />
        <Route component={Error404Page} />
      </Switch>
    </main>
  </div>;

const Error404Page = () =>
  <Message color="danger">
    <Message.Body>
      <h4>Whoops</h4>
      <p>The page you are looking for does not exist.</p>
    </Message.Body>
  </Message>;


const NavbarLink = (props: {to: string, children?: any}) =>
  <Navbar.Item renderAs={NavLink}
      {...{to: props.to, activeClassName: "is-active"}}>
    {props.children}
  </Navbar.Item>


type SearchBarProps = RouteComponentProps<{query?: string}>;

class SearchBar extends React.Component<SearchBarProps, {query: string}> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { query: props.match.params.query || "" };
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.history.push(`/search/${this.state.query}`);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({query: event.target.value});
  }

  componentWillReceiveProps(nextProps: SearchBarProps) {
    if (nextProps.match.params.query !== this.state.query) {
      this.setState({ query: nextProps.match.params.query || "" });
    }
  }

  render() {
    return (
      <form onSubmit={(e) => this.onSubmit(e)}>
        <Form.Field kind="addons">
          <Form.Control>
            <Form.Input type="search" placeholder="Search"
              value={this.state.query}
              onChange={(e) => this.onChange(e)} />
          </Form.Control>
          <Form.Control>
            <Button title="Search">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form.Control>
        </Form.Field>
      </form>
    );
  }
}


ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById("react-container")
);
