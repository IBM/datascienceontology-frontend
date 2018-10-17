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
  kind: "object" | "morphism";
  
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
export interface Object extends Concept {
  /* Kind of concept. */
  kind: "object";
}

/** Morphism concept in an ontology.
 */
export interface Morphism extends Concept {
  /* Kind of concept. */
  kind: "morphism";

  /* Domain of morphism. */
  domain: DomainObject[];
  
  /* Codomain of morphism. */
  codomain: DomainObject[];
}

/** Object belonging to the domain or codomain of a morphism.
 */
export interface DomainObject {
  /* ID of an object concept */
  object: string;
  
  /* Syntactic name of domain object */
  name?: string;
  
  /* Human-readable description of domain object */
  description?: string;
}

export function isObject(concept: Concept): concept is Object {
 return concept.kind === "object";
}

export function isMorphism(concept: Concept): concept is Morphism {
 return concept.kind === "morphism";
}
