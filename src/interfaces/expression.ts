
/** S-expression in JSON-able format.

  The same definition is used in the database JSON schemas for concepts and
  annotations.
 */
export type SExp = string | SExpArray;

export interface SExpArray extends Array<string | SExpArray> {}
