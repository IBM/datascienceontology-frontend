import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Router from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Message,
  Navbar
} from "react-bulma-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { HomePage } from "./pages/home";
import { AnnotationPage } from "./pages/annotation";
import { AnnotationIndexPage } from "./pages/annotation_index";
import { ConceptPage } from "./pages/concept";
import { ConceptIndexPage } from "./pages/concept_index";
import { MarkdownPage, MarkdownDisplay } from "./pages/markdown";
import { SearchPage } from "./pages/search";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "react-bulma-components/dist/react-bulma-components.min.css";
import "bulma-helpers/css/bulma-helpers.min.css";
import "./style/main.css";

const App = () => (
  <div id="app">
    <Navbar color="dark">
      <Navbar.Brand>
        <Navbar.Item renderAs={Router.Link} {...{ to: "/" }} textSize={5}>
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
        <NavbarLink to="/browse">Browse</NavbarLink>
        <NavbarLink to="/help">Help</NavbarLink>
        <NavbarLink to="/about">About</NavbarLink>
      </Navbar.Container>
    </Navbar>
    <Container renderAs="main" className="has-margin-top-15">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/annotation/:language/:package/:id"
          component={AnnotationPage}
        />
        <Route path="/concept/:id" component={ConceptPage} />
        <Route
          exact
          path="/browse"
          component={() => <MarkdownDisplay page="browse" />}
        />
        <Route
          exact
          path="/browse/annotations"
          component={AnnotationIndexPage}
        />
        <Route exact path="/browse/concepts" component={ConceptIndexPage} />
        <Route path="/search/:query?" component={SearchPage} />
        <Route
          exact
          path="/about"
          component={() => <MarkdownDisplay page="about" />}
        />
        <Route
          exact
          path="/help"
          component={() => <MarkdownDisplay page="help" />}
        />
        <Route path="/help/:page" component={MarkdownPage} />
        <Route component={Error404Page} />
      </Switch>
    </Container>
  </div>
);

const Error404Page = () => (
  <Message color="danger">
    <Message.Body>
      <h4>Whoops</h4>
      <p>The page you are looking for does not exist.</p>
    </Message.Body>
  </Message>
);

const NavbarLink = (props: { to: string; children?: any }) => (
  <Navbar.Item
    renderAs={Router.NavLink}
    {...{ to: props.to, activeClassName: "is-active" }}
  >
    {props.children}
  </Navbar.Item>
);

type SearchBarProps = Router.RouteComponentProps<{ query?: string }>;

class SearchBar extends React.Component<SearchBarProps, { query: string }> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { query: props.match.params.query || "" };
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.history.push(`/search/${this.state.query}`);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ query: event.target.value });
  }

  componentDidUpdate(prevProps: SearchBarProps) {
    if (this.props.match.params.query !== prevProps.match.params.query) {
      this.setState({ query: this.props.match.params.query || "" });
    }
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <Form.Field kind="addons">
          <Form.Control>
            <Form.Input
              type="search"
              placeholder="Search"
              value={this.state.query}
              onChange={e => this.onChange(e)}
            />
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
  <Router.BrowserRouter>
    <App />
  </Router.BrowserRouter>,
  document.getElementById("root")
);
