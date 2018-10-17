import { SExp } from "./expression";
import { Cytoscape } from "./cytoscape";

/** Cached data for a code annotation.

Used by the frontend to display the annotation.
*/
export interface AnnotationCache {
  /* ID of document in database. */
  _id?: string;
  
  /* Language, package, and ID of annotation; see `Annotation` interface. */
  language: string;
  package: string;
  id: string;
  
  /* Kind of concept in ontology: "object" or "morphism". */
  kind: string;
  
  /* Definition of annotated code as concept in ontology. */
  definition: {
    /* Definition as S-expression. */
    expression: SExp;
    
    /* Definition as Graphviz JSON. */
    graphviz?: any;
    
    /* Definition as Cytoscape elements data. */
    cytoscape?: Cytoscape;
  }
}
