import * as React from "react";
import * as Router from "react-router-dom";

import * as Cloudant from "../cloudant";
import * as Services from "../services";
import { SearchBar } from "../components";
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
  results: Array<IConcept>;
  total_results: number;
}

export class OntologyResults extends React.Component<OntologyResultsProps,OntologyResultsState> {
  constructor(props: OntologyResultsProps) {
    super(props);
    this.state = {
      results: [],
      total_results: 0
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
      query: query,
      limit: 25
    }).then(response => {
        const results = response.rows.map(row => {
          // Include document with ID with other IConcept fields.
          return {
            _id: row.id,
            ...row.fields
          } as IConcept;
        });
        this.setState({
          results: results,
          total_results: response.total_rows,
        });
      });
  }
  
  render() {
    return <div className="search-results">
      <p className="text-muted">{this.state.total_results} results</p>
      <ul>
        {this.state.results.map(concept => 
          <li key={concept._id}>{concept.name}</li>)}
      </ul>
    </div>;
  }
}
