import { SExp } from "./expression";

/** Concept in an ontology.

  Mirrors the JSON schema for the database.
 */
export interface Concept {
  /* ID of document in database. */
  _id?: string;
  
  /* Schema of document in database. */
  schema?: "concept";
  
  /* ID for concept, unique within ontology */
  id: string;
  
  /* Human-readable name of concept */
  name: string;
  
  /* Human-readable description of concept in Markdown */
  description?: string;
  
  /* Kind of concept. */
  kind: "type" | "function";
  
  /* Definition of concept in terms of other concepts */
  definition?: SExp;
  
  /* Concept is a sub-concept of these concepts */
  "is-a"?: string | string[];

  /* Links to external resources about the concept. */
  external?: {
    /* Wikidata concept identifier. */
    wikidata?: string;

    /* Wikipedia page (name only, English language). */
    wikipedia?: string;
  };
}

/** Object concept in an ontology.
 */
export interface TypeConcept extends Concept {
  /* Kind of concept. */
  kind: "type";
}

/** Morphism concept in an ontology.
 */
export interface FunctionConcept extends Concept {
  /* Kind of concept. */
  kind: "function";

  /* Inputs of function. */
  inputs: Port[];
  
  /* Outputs of function. */
  outputs: Port[];
}

/** Input or output of a function.
 */
export interface Port {
  /* ID of a type concept */
  type: string;
  
  /* Syntactic name of port */
  name?: string;
  
  /* Human-readable description of port */
  description?: string;
}

export function isType(concept: Concept): concept is TypeConcept {
 return concept.kind === "type";
}

export function isFunction(concept: Concept): concept is FunctionConcept {
 return concept.kind === "function";
}
