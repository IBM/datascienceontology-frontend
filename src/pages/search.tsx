import * as React from "react";
import * as Router from "react-router-dom";
import { Badge, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/fontawesome-free-solid";

import { Concept, Annotation } from "open-discovery";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import { ConceptFullName } from "./concept";
import { AnnotationFullName } from "./annotation";
import * as Cloudant from "../cloudant";
import * as Config from "../config";

import "../../style/pages/search.css";


type SearchPageProps = Router.RouteComponentProps<{query?: string}>;

export const SearchPage = (props: SearchPageProps) => {
  const query = props.match.params.query;
  return (
    <section id="search">
      {query && <SearchResults query={query} />}
    </section>
  );
}


interface SearchResultsProps {
  query: string;
}
interface SearchResultsState {
  loading: boolean;
  activeTab: "concepts" | "annotations";
  concepts: Concept.Concept[];
  annotations: Annotation.Annotation[];
  totalConcepts: number;
  totalAnnotations: number;
}

export class SearchResults extends React.Component<SearchResultsProps,SearchResultsState> {
  constructor(props: SearchResultsProps) {
    super(props);
    this.state = {
      loading: false,
      activeTab: "concepts",
      concepts: [],
      annotations: [],
      totalConcepts: 0,
      totalAnnotations: 0,
    }
  }
  
  componentWillMount() {
    this.search(this.props.query);
  }
  componentWillReceiveProps(nextProps: SearchResultsProps) {
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
    return Cloudant.search<Concept.Concept>({
      dbURL: Config.dbURL,
      dbName: Config.dbName,
      ddoc: "search",
      index: "concept",
      request: {
        query: query,
      },
    }).then(response => {
      this.setState({
        concepts: response.rows.map(row => row.fields),
        totalConcepts: response.total_rows,
      });
    });
  }
  
  searchAnnotations(text: string): Promise<void> {
    const query = [
      `language:(${text})`, `package:(${text})^3`, `id:(${text})^100`,
      `name:(${text})^3`, `description:(${text})`,
      `class:(${text})`, `function:(${text})`, `method:(${text})`
    ].join(" ");
    return Cloudant.search<Annotation.Annotation>({
      dbURL: Config.dbURL,
      dbName: Config.dbName,
      ddoc: "search",
      index: "annotation",
      request: {
        query: query,
      },
    }).then(response => {
      this.setState({
        annotations: response.rows.map(row => row.fields),
        totalAnnotations: response.total_rows,
      });
    });
  }
  
  render() {
    if (this.state.loading) {
      return <FontAwesomeIcon icon={faSpinner} spin/>;
    }
        
    return <section className="search-results">
      <Nav tabs>
        <NavItem className="mt-0">
          <NavLink onClick={() => this.setState({activeTab: "concepts"})}
                   active={this.state.activeTab === "concepts"}
                   disabled={this.state.totalConcepts === 0}>
            <SchemaGlyph schema="concept" />
            {" "}
            Concepts
            <Badge color="light" className="ml-2">
              {this.state.totalConcepts}
            </Badge>
          </NavLink>
        </NavItem>
        <NavItem className="mt-0">
          <NavLink onClick={() => this.setState({activeTab: "annotations"})}
                   active={this.state.activeTab === "annotations"}
                   disabled={this.state.totalAnnotations === 0}>
            <SchemaGlyph schema="annotation" />
            {" "}
            Annotations
            <Badge color="light" className="ml-2">
              {this.state.totalAnnotations}
            </Badge>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="concepts">
          <ul>
            {this.state.concepts.map(concept =>
              <li key={concept.id} >
                <ConceptResult concept={concept} />
              </li>)}
          </ul>
        </TabPane>
        <TabPane tabId="annotations">
          <ul>
            {this.state.annotations.map((annotation,i) =>
              <li key={i} >
                <AnnotationResult annotation={annotation} />
              </li>)}
          </ul>
        </TabPane>
      </TabContent>
    </section>;
  }
}


export const ConceptResult = (props: {concept: Concept.Concept}) => {
  const concept = props.concept;
  return <div className="search-result">
    <KindGlyph kind={concept.kind} />
    {" "}
    <ConceptFullName concept={concept} />
    {concept.description && <p>{concept.description}</p>}
  </div>;
}

export const AnnotationResult = (props: {annotation: Annotation.Annotation}) => {
  const note = props.annotation;
  return <div className="search-result">
    <KindGlyph kind={note.kind} />
    {" "}
    <LanguageGlyph language={note.language} />
    {" "}
    <AnnotationFullName annotation={note} />
    {note.description && <p>{note.description}</p>}
  </div>;
}
