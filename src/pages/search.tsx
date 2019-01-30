import * as React from "react";
import * as Router from "react-router-dom";
import { Tabs, Tag } from "react-bulma-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import * as Concept from "../interfaces/concept";
import * as Annotation from "../interfaces/annotation";
import { KindGlyph, LanguageGlyph, SchemaGlyph } from "../components/glyphs";
import { ConceptFullName } from "./concept";
import { AnnotationFullName } from "./annotation";
import { apiUrl } from "../config";

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
    return fetch(`${apiUrl}/search/concept/${encodeURIComponent(text)}`)
      .then(response => response.json() as Promise<Concept.Concept[]>)
      .then(concepts => {
        this.setState({
          concepts,
          totalConcepts: concepts.length,
        });
      });
  }

  searchAnnotations(text: string): Promise<void> {
    return fetch(`${apiUrl}/search/annotation/${encodeURIComponent(text)}`)
      .then(response => response.json() as Promise<Annotation.Annotation[]>)
      .then(annotations => {
        this.setState({
          annotations,
          totalAnnotations: annotations.length,
        });
      });
  }
  
  render() {
    if (this.state.loading) {
      return <FontAwesomeIcon icon={faSpinner} spin/>;
    }
        
    return <section className="search-results">
      <Tabs>
        <Tabs.Tab active={this.state.activeTab === "concepts"}
            onClick={() => this.setState({activeTab: "concepts"})}>
          <SchemaGlyph schema="concept" />
          {" "}
          Concepts
          {" "}
          <Tag color="light">
            {this.state.totalConcepts}
          </Tag>
        </Tabs.Tab>
        <Tabs.Tab active={this.state.activeTab === "annotations"}
            onClick={() => this.setState({activeTab: "annotations"})}>
          <SchemaGlyph schema="annotation" />
          {" "}
          Annotations
          {" "}
          <Tag color="light">
            {this.state.totalAnnotations}
          </Tag>
        </Tabs.Tab>
      </Tabs>
      {this.state.activeTab === "concepts" ?
        <ul>
          {this.state.concepts.map(concept =>
            <li key={concept.id} >
              <ConceptResult concept={concept} />
            </li>)}
        </ul> :
        <ul>
          {this.state.annotations.map((annotation,i) =>
            <li key={i} >
              <AnnotationResult annotation={annotation} />
            </li>)}
        </ul>}
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
