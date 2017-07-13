import * as PouchDB from "pouchdb";

const db_origin = "***REMOVED***";
const db_name = "data-science-ontology";
export const db_url = `${db_origin}/${db_name}`;

export const db = new PouchDB(db_url);
