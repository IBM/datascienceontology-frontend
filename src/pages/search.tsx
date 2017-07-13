import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Router from "react-router-dom";

import * as Cloudant from "../cloudant";
import * as Common from "../common";
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
    Cloudant.search<IConcept>(`${Common.db_url}/_design/search/_search/concept`, {
      query: this.props.query
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

/** A generic search bar.

  Implemented as an "uncontrolled component", in the React jargon.
*/
export class SearchBar extends React.Component<SearchBarProps,{}> {
  private input: HTMLInputElement;
  
  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = this.input.value;
    if (this.props.onSearch && query) {
      this.props.onSearch(query);
    }
  }
  
  render() {
    return <div className="search-bar">
      <form onSubmit={this.onSubmit}>
        <input type="text" ref={(input) => this.input = input}
               defaultValue={this.props.defaultQuery}
               placeholder={this.props.placeholder} />
        <input type="submit" value="Submit" />
      </form>
    </div>;
  }
}
