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
  
  componentDidMount() {
    this.search(this.props.query);
  }
  componentDidUpdate(prevProps: SearchResultsProps) {
    if (this.props.query !== prevProps.query) {
      this.search(this.props.query);
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
        
    return <section id="search-results">
      <Tabs>
        <Tabs.Tab active={this.state.activeTab === "concepts"}
            onClick={() => this.setState({activeTab: "concepts"})}>
          <span className="has-margin-right-5">
            <SchemaGlyph schema="concept"/>
          </span>
          Concepts
          <Tag color="light" className="has-margin-left-10">
            {this.state.totalConcepts}
          </Tag>
        </Tabs.Tab>
        <Tabs.Tab active={this.state.activeTab === "annotations"}
            onClick={() => this.setState({activeTab: "annotations"})}>
          <span className="has-margin-right-5">
            <SchemaGlyph schema="annotation"/>
          </span>
          Annotations
          <Tag color="light" className="has-margin-left-10">
            {this.state.totalAnnotations}
          </Tag>
        </Tabs.Tab>
      </Tabs>
      {this.state.activeTab === "concepts" ?
        <ul>
          {this.state.concepts.map(concept =>
            <li key={concept.id} className="has-margin-bottom-20">
              <ConceptResult concept={concept} />
            </li>)}
        </ul> :
        <ul>
          {this.state.annotations.map((annotation,i) =>
            <li key={i} className="has-margin-bottom-20">
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
