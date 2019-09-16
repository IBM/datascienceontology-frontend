import { Diagrams, Graphviz } from "wiring-diagram-canvas";
import { SExp } from "./expression";

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
  
  /* Kind of concept in ontology. */
  kind: "type" | "function";
  
  /* Definition of annotated code as concept in ontology. */
  definition: {
    /* Definition as S-expression. */
    expression: SExp;

    /* Definition as wiring diagram. */
    diagram: Diagrams.WiringDiagram;
    
    /* Definition as Graphviz JSON. */
    graphviz?: Graphviz.Graph;
  }
}
