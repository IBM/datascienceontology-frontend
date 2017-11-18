import * as React from "react";
import * as Router from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import FontAwesome = require("react-fontawesome");

import { Concept, Annotation } from "open-discovery";
import { SearchBar } from "open-discovery-components";
import * as Cloudant from "../cloudant";
import * as Config from "../config";

import "../../style/pages/search.css";


type SearchPageProps = Router.RouteComponentProps<{query?: string}>;

export const SearchPage = (props: SearchPageProps) => {
  const query = props.match.params.query;
  return (
    <section className="search">
      <OntologySearchBar/>
      {query && <OntologyResults query={query} />}
    </section>
  );
}


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
  concepts: Concept[];
  total_concepts: number;
  annotations: Annotation[];
  total_annotations: number;
}

export class OntologyResults extends React.Component<OntologyResultsProps,OntologyResultsState> {
  constructor(props: OntologyResultsProps) {
    super(props);
    this.state = {
      loading: false,
      concepts: [],
      total_concepts: 0,
      annotations: [],
      total_annotations: 0
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
  
  search(text: string) {
    this.setState({loading: true});
    Promise.all([
      this.searchConcepts(text),
      this.searchAnnotations(text),
    ]).then(result => {
      this.setState({loading: false});
    });
  }
  
  searchConcepts(text: string): Promise<void> {
    const query = [
      `id:(${text})^100`,      // Exact match on ID due to `keyword` analyzer
      `name:(${text})^3`,      // Inexact match on name
      `description:(${text})`, // Inexact match on description
    ].join(" ");
    
    return Cloudant.search<Concept>(`${Config.db_url}/_design/search/_search/concept`, {
      query: query,
      limit: 10
    }).then(response => {
      this.setState({
        concepts: response.rows.map(row => row.fields),
        total_concepts: response.total_rows,
      });
    });
  }
  
  searchAnnotations(text: string): Promise<void> {
    const query = [
      `language:(${text})`, `package:(${text})^3`, `id:(${text})^100`,
      `name:(${text})^3`, `description:(${text})`,
      `class:(${text})`, `function:(${text})`, `method:(${text})`
    ].join(" ");

    return Cloudant.search<Annotation>(`${Config.db_url}/_design/search/_search/annotation`, {
      query: query,
      limit: 10
    }).then(response => {
      this.setState({
        annotations: response.rows.map(row => row.fields),
        total_annotations: response.total_rows,
      });
    });
  }
  
  render() {
    if (this.state.loading) {
      return <FontAwesome name="spinner" spin/>;
    }
        
    return <section className="search-results">
      <Tabs>
        <Tab eventKey={1} disabled={this.state.total_concepts === 0}
             title={`Concepts (${this.state.total_concepts})`}>
          <ul>
            {this.state.concepts.map(concept =>
              <li key={concept.id} >
                <ConceptResult concept={concept} />
              </li>)}
          </ul>
        </Tab>
        <Tab eventKey={2} disabled={this.state.total_annotations === 0}
             title={`Annotations (${this.state.total_annotations})`}>
          <ul>
            {this.state.annotations.map((annotation,i) =>
              <li key={i} >
                <AnnotationResult annotation={annotation} />
              </li>)}
          </ul>
        </Tab>
      </Tabs>
    </section>;
  }
}


export const ConceptResult = (props: {concept: Concept}) => {
  const concept = props.concept;
  return <div className="search-result">
    <KindGlyph kind={concept.kind} />
    {" "}
    <Router.Link to={`/concept/${concept.id}`}>
      {concept.name}
    </Router.Link>
    {" "}
    <span className="text-muted">
      ({concept.id})
    </span>
    {concept.description !== undefined && <p>{concept.description}</p>}
  </div>;
}

export const AnnotationResult = (props: {annotation: Annotation}) => {
  const note = props.annotation;
  const key = `${note.language}/${note.package}/${note.id}`;
  return <div className="search-result">
    <KindGlyph kind={note.kind} />
    {" "}
    <Router.Link to={`/annotation/${key}`}>
      {note.name !== undefined ? note.name : note.id}
    </Router.Link>
    {" "}
    <span className="text-muted">
      ({key})
    </span>
    {note.description !== undefined && <p>{note.description}</p>}
  </div>;
}

const KindGlyph = (props: {kind: string}) => {
  if (props.kind === "object") {
    return <FontAwesome name="circle-o" />;
  } else if (props.kind === "morphism") {
    return <FontAwesome name="long-arrow-right" />;
  }
  return null;
}
