import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, RouteComponentProps, Switch, Link,
  NavLink as RouterNavLink} from "react-router-dom";
import { Alert, Button, Form, Input, InputGroup,
  Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";

import { HomePage } from "./pages/home";
import { AnnotationPage } from "./pages/annotation";
import { ConceptPage } from "./pages/concept";
import { MarkdownPage } from "./pages/markdown";
import { SearchPage } from "./pages/search";

import "../style/main.css";
import "../style/bootstrap.css";


const App = () =>
  <div id="app">
    <Navbar expand dark color="dark">
      <NavbarBrand tag={Link} {...{to: "/"}}>
        Data Science Ontology
      </NavbarBrand>
      <Switch>
        <Route path="/search/:query?" component={SearchBar} />
        <Route component={SearchBar} />
      </Switch>
      <Nav navbar className="ml-auto">
        <NavItem>
          <NavLink tag={RouterNavLink} {...{to: "/page/help"}}>
            Help
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RouterNavLink} {...{to: "/page/about"}}>
            About
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
    <main>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/annotation/:language/:package/:id" component={AnnotationPage} />
        <Route path="/concept/:id" component={ConceptPage} />
        <Route path="/search/:query?" component={SearchPage} />
        <Route path="/page/:page" component={MarkdownPage} />
        <Route component={Error404Page} />
      </Switch>
    </main>
  </div>;

const Error404Page = () =>
  <Alert color="danger">
    <h4>Whoops</h4>
    <p>The page you are looking for does not exist.</p>
  </Alert>;


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
      <Form inline onSubmit={(e) => this.onSubmit(e)}>
        <InputGroup>
          <Input type="search" value={this.state.query}
                 placeholder="Search the ontology"
                 onChange={(e) => this.onChange(e)} />
          <Button type="submit">Search</Button>
        </InputGroup>
      </Form>
    );
  }
}


ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById("react-container")
);
