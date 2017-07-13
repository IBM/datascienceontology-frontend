import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Router from "react-router-dom";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap";

import * as Cloudant from "../cloudant";
import * as Services from "../services";
import { IConcept } from "../models/concept";


type SearchPageProps = Router.RouteComponentProps<{query: string}>;

export const SearchPage = (props: SearchPageProps) =>
  <section className="search">
    <OntologySearchBar/>
    <OntologyResults query={props.match.params.query} />
  </section>;


type OntologySearchBarProps = Router.RouteComponentProps<{query?: string}>;

class OntologySearchBarWithoutRouter extends React.Component<OntologySearchBarProps,{}> {
  onSearch = (query: string) => {
    this.props.history.push(`/search/${query}`);
  }
  
  render() {
    return (
      <SearchBar defaultQuery={this.props.match.params.query}
                 placeholder="Search the ontology"
                 onSearch={this.onSearch}/>
    );
  }
}
export const OntologySearchBar = Router.withRouter<{}>(OntologySearchBarWithoutRouter);
  


interface OntologyResultsProps {
  query: string;
}
interface OntologyResultsState {
  concepts: Array<IConcept>;
}

export class OntologyResults extends React.Component<OntologyResultsProps,OntologyResultsState> {
  constructor(props: OntologyResultsProps) {
    super(props);
    this.state = {
      concepts: []
    }
  }
  
  componentWillMount() {
    this.search(this.props.query);
  }
  componentWillReceiveProps(nextProps: OntologyResultsProps) {
    if (nextProps.query !== this.props.query) {
      this.search(nextProps.query);
    }
  }
  
  search(query: string) {
    Cloudant.search<IConcept>(`${Services.db_url}/_design/search/_search/concept`, {
      query: query
    }).then(response => {
        const concepts = response.rows.map(row => {
          // Include document with ID with other IConcept fields.
          return {
            _id: row.id,
            ...row.fields
          } as IConcept;
        });
        this.setState({concepts: concepts});
      });
  }
  
  render() {
    return <div className="search-results">
      <ul>
        {this.state.concepts.map(concept => 
          <li key={concept._id}>{concept.name}</li>)}
      </ul>
    </div>;
  }
}

interface SearchBarProps {
  defaultQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}
interface SearchBarState {
  query: string;
}

/** A generic search bar.
*/
export class SearchBar extends React.Component<SearchBarProps,SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      query: props.defaultQuery || ""
    };
  }
  
  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.onSearch && this.state.query) {
      this.props.onSearch(this.state.query);
    }
  }
  
  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({query: event.target.value});
  }
  
  render() {
    // XXX: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16208
    return <div className="search-bar">
      <Form onSubmit={(e) => this.onSubmit(e as any)}>
        <InputGroup>
          <FormControl type="text" value={this.state.query}
                       placeholder={this.props.placeholder}
                       onChange={(e) => this.onChange(e as any)} />
          <InputGroup.Button>
            <Button type="submit">Search</Button>
          </InputGroup.Button>
        </InputGroup>
      </Form>
    </div>;
  }
}
