import * as React from "react";
import * as Router from "react-router-dom";
import FontAwesome = require("react-fontawesome");

import { Concept } from "data-science-ontology";
import * as Cloudant from "../cloudant";
import * as Services from "../services";
import { SearchBar } from "../components/search_bar";

import "../../style/pages/search.css";


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
  loading: boolean;
  results: Array<Concept>;
  total_results: number;
}

export class OntologyResults extends React.Component<OntologyResultsProps,OntologyResultsState> {
  constructor(props: OntologyResultsProps) {
    super(props);
    this.state = {
      loading: false,
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
  
  luceneQuery(text: string): string {
    return [
      `id:(${text})^100`,      // Exact match on ID due to `keyword` analyzer
      `name:(${text})^3`,      // Inexact match on name
      `description:(${text})`, // Inexact match on description
    ].join(" ");
  }
  
  search(text: string) {
    this.setState({loading: true});
    Cloudant.search<Concept>(`${Services.db_url}/_design/search/_search/concept`, {
      query: this.luceneQuery(text),
      limit: 25
    }).then(response => {
        const results = response.rows.map(row => {
          // Include document with ID with other Concept fields.
          return {
            _id: row.id,
            ...row.fields
          } as Concept;
        });
        this.setState({
          loading: false,
          results: results,
          total_results: response.total_rows,
        });
      });
  }
  
  render() {
    if (this.state.loading) {
      return <FontAwesome name="spinner" spin/>;
    }
    return <section className="search-results">
      <p className="text-muted">{this.state.total_results} results</p>
      <ul>
        {this.state.results.map(concept =>
          <li key={concept._id} >
            <ConceptResult concept={concept} />
          </li>)}
      </ul>
    </section>;
  }
}


export const ConceptResult = (props: {concept: Concept}) => {
  const concept = props.concept;
  return (
    <div className="search-result">
      <KindGlyph kind={concept.kind} />
      {' '}
      <Router.Link to={`/concept/${concept.id}`}>
        {concept.name}
      </Router.Link>
      {' '}
      <span className="text-muted">
        ({concept.id})
      </span>
      {concept.description !== undefined && <p>{concept.description}</p>}
    </div>
  );
}

const KindGlyph = (props: {kind: string}) => {
  if (props.kind === "object") {
    return <FontAwesome name="circle-o" />;
  } else if (props.kind === "morphism") {
    return <FontAwesome name="long-arrow-right" />;
  }
  return null;
}
