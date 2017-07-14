/** Object belonging to the domain or codomain of a morphism.
 */
export interface IDomainObject {
  /* ID of an object concept. */
  object: string;
  
  /* Human-readable name of domain object. */
  name?: string;
}

/** Concept in an ontology.

  Mirrors the JSON schema for the database.
 */
export interface IConcept {
  /* ID of document in database. */
  _id?: string;
  
  /* Ontology to which concept belongs. */
  ontology?: string;
  
  /* ID for concept, unique within ontology */
  id: string;
  
  /* Human-readable name of concept */
  name: string;
  
  /* Human-readable description of concept in Markdown */
  description?: string;
  
  /* Kind of concept: "object" or "morphism" */
  kind: string;
  
  /* Definition of concept in terms of other concepts */
  definition?: any;
  
  /* Domain and codomain of concept, if it is a morphism */
  domain?: Array<IDomainObject>;
  codomain?: Array<IDomainObject>;
}
