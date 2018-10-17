import { SExp } from "./expression";

/** Code annotation in an ontology.

  Mirrors the JSON schema for the database.
*/
export interface Annotation {
  /* ID of document in database. */
  _id?: string;
  
  /* Schema of document in database. */
  schema?: "annotation";
  
  /* Programming language of annotated code. */
  language: "python" | "r";
  
  /* Library or package of annotated code. */
  package: string;
  
  /* Identifer for annotation, unique within language and package. */
  id: string;
  
  /* Human-readable name of annotated code object. */
  name?: string;
  
  /* Human-readable description of annotated code object. */
  description?: string;
  
  /* Kind of annotation. */
  kind: "object" | "morphism";
  
  /* Definition of annotated code as concept in ontology. */
  definition: SExp;
}

/** Object annotation in ontology.
 */
export interface ObjectAnnotation extends Annotation {
  /* Kind of annotation. */
  kind: "object";
}

/** Morphism annotation in ontology.
 */
export interface MorphismAnnotation extends Annotation {
  /* Kind of annotation. */
  kind: "morphism";
}


/** Annotation for a Python class, function, or method.
 */
export interface PythonAnnotation extends Annotation {
  /* Programming language of annotated code. */
  language: "python";
}

/** Annotation for a Python class.
 */
export interface PythonObject extends PythonAnnotation {
  /* Kind of annotation. */
  kind: "object";

  /* Python class to which annotation applies. */
  class: string | Array<string>;
  
  /* Slots corresponding to morphisms in the ontology.
   */
  slots?: Slot[];
}

/** Annotation for a Python function or method.
 */
export interface PythonMorphism extends Annotation {
  /* Kind of annotation. */
  kind: "morphism";

  /* Fully qualified name of function, if annotating a function. */
  function?: string;
  
  /* Class to which annotation applies, if annotating a method. */
  class?: string | Array<string>;
  
  /* Unqualified name of method, if annotating a method. */
  method?: string;
  
  /* Mapping of arguments (positional and named) to morphism domain/ */
  domain: DomainObject[];
  
  /* Mapping of mutated arguments and return value to morphism codomain. */
  codomain: DomainObject[];
}


/** Annotation for an R class or function.
 */
export interface RAnnotation extends Annotation {
  /* Programming language of annotated code. */
  language: "r";
}

/** Annotation for an R class.
 */
export interface RObject extends RAnnotation {
  /* Kind of annotation. */
  kind: "object";

  /* R class to which annotation applies. */
  class: string;

  /* Object-oriented system to which class belongs (default S3). */
  system?: string;
  
  /* Slots corresponding to morphisms in the ontology.
   */
  slots?: Slot[];
}

/** Annotation for an R function.
 */
export interface RMorphism extends RAnnotation {
  /* Kind of annotation. */
  kind: "morphism";

  /* Name of function. */
  function: string;
  
  /* Class on which function dispatches, if generic. */
  class?: string;

  /* Object-oriented system of function, if generic (default S3). */
  system?: string;
  
  /* Mapping of arguments (positional and named) to morphism domain/ */
  domain: DomainObject[];
  
  /* Mapping of mutated arguments and return value to morphism codomain. */
  codomain: DomainObject[];
}


/** Object belonging to the domain or codomain of a concrete function or method.
 */
export interface DomainObject {
  /* Function slot (argument or return value) */
  slot: number | string;
  
  /* Syntactic name of domain object */
  name?: string;
  
  /* Human-readable description of domain object */
  description?: string;
}

/** Slot corresponding to a morphism in the ontology.
 */
export interface Slot {
  /* Language-specific slot specification. */
  slot: string;
  
  /* Definition of slot as morphism in ontology. */
  definition: SExp;
}


export function isObject(note: Annotation): note is ObjectAnnotation {
  return note.kind === "object";
}

export function isMorphism(note: Annotation): note is MorphismAnnotation {
  return note.kind === "morphism";
}

export function isPython(note: Annotation): note is PythonAnnotation {
  return note.language === "python";
}

export function isPythonObject(note: Annotation): note is PythonObject {
  return note.language === "python" && note.kind === "object";
}

export function isPythonMorphism(note: Annotation): note is PythonMorphism {
  return note.language === "python" && note.kind === "morphism";
}

export function isR(note: Annotation): note is RAnnotation {
  return note.language === "r";
}

export function isRObject(note: Annotation): note is RObject {
  return note.language === "r" && note.kind === "object";
}

export function isRMorphism(note: Annotation): note is RMorphism {
  return note.language === "r" && note.kind === "morphism";
}
