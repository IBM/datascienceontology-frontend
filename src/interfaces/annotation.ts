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

  /* Human-readable name of annotated code entity. */
  name?: string;

  /* Human-readable description of annotated code entity. */
  description?: string;

  /* Kind of annotation. */
  kind: "type" | "function";

  /* Definition of annotated code as concept in ontology. */
  definition: SExp;
}

/** Type annotation in ontology.
 */
export interface TypeAnnotation extends Annotation {
  /* Kind of annotation. */
  kind: "type";
}

/** Function annotation in ontology.
 */
export interface FunctionAnnotation extends Annotation {
  /* Kind of annotation. */
  kind: "function";
}

/** Annotation for a Python class, function, or method.
 */
export interface PythonAnnotation extends Annotation {
  /* Programming language of annotated code. */
  language: "python";
}

/** Annotation for a Python class.
 */
export interface PythonType extends PythonAnnotation {
  /* Kind of annotation. */
  kind: "type";

  /* Python class to which annotation applies. */
  class: string | Array<string>;

  /* Slots corresponding to functions in the ontology.
   */
  slots?: Slot[];
}

/** Annotation for a Python function or method.
 */
export interface PythonFunction extends Annotation {
  /* Kind of annotation. */
  kind: "function";

  /* Fully qualified name of function, if annotating a function. */
  function?: string;

  /* Class to which annotation applies, if annotating a method. */
  class?: string | Array<string>;

  /* Unqualified name of method, if annotating a method. */
  method?: string;

  /* Mapping of arguments (positional and named) to function inputs. */
  inputs: PortAnnotation[];

  /* Mapping of mutated arguments and return value to function outputs. */
  outputs: PortAnnotation[];
}

/** Annotation for an R class or function.
 */
export interface RAnnotation extends Annotation {
  /* Programming language of annotated code. */
  language: "r";
}

/** Annotation for an R class.
 */
export interface RType extends RAnnotation {
  /* Kind of annotation. */
  kind: "type";

  /* R class to which annotation applies. */
  class: string;

  /* Object-oriented system to which class belongs (default S3). */
  system?: string;

  /* Slots corresponding to functions in the ontology.
   */
  slots?: Slot[];
}

/** Annotation for an R function.
 */
export interface RFunction extends RAnnotation {
  /* Kind of annotation. */
  kind: "function";

  /* Name of function. */
  function: string;

  /* Class on which function dispatches, if generic. */
  class?: string;

  /* Object-oriented system of function, if generic (default S3). */
  system?: string;

  /* Mapping of arguments (positional and named) to function inputs. */
  inputs: PortAnnotation[];

  /* Mapping of mutated arguments and return value to function outputs. */
  outputs: PortAnnotation[];
}

/** Input or output of a concrete function or method.
 */
export interface PortAnnotation {
  /* Function slot (argument or return value) */
  slot: number | string;

  /* Syntactic name of port */
  name?: string;

  /* Human-readable description of port */
  description?: string;
}

/** Slot corresponding to a function in the ontology.
 */
export interface Slot {
  /* Language-specific slot specification. */
  slot: string;

  /* Definition of slot as function in ontology. */
  definition: SExp;
}

export function isType(note: Annotation): note is TypeAnnotation {
  return note.kind === "type";
}

export function isFunction(note: Annotation): note is FunctionAnnotation {
  return note.kind === "function";
}

export function isPython(note: Annotation): note is PythonAnnotation {
  return note.language === "python";
}

export function isPythonType(note: Annotation): note is PythonType {
  return note.language === "python" && note.kind === "type";
}

export function isPythonFunction(note: Annotation): note is PythonFunction {
  return note.language === "python" && note.kind === "function";
}

export function isR(note: Annotation): note is RAnnotation {
  return note.language === "r";
}

export function isRType(note: Annotation): note is RType {
  return note.language === "r" && note.kind === "type";
}

export function isRFunction(note: Annotation): note is RFunction {
  return note.language === "r" && note.kind === "function";
}
