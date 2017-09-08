import PouchDB from "pouchdb";

// DSO databse
const db_origin = "***REMOVED***";
const db_name = "data-science-ontology";
export const db_url = `${db_origin}/${db_name}`;
export const db = new PouchDB(db_url);

// DSO web application database
const app_db_name = "data-science-ontology-webapp";
export const app_db_url = `${db_origin}/${app_db_name}`;
export const app_db = new PouchDB(app_db_url);
