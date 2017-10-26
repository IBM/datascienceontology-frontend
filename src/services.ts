import PouchDB from "pouchdb";
import * as Config from "./config";

/* CouchDB database for data science ontology. */
export const db = new PouchDB(Config.db_url);

/* CouchDB database for web application frontend of data science ontology. */
export const app_db = new PouchDB(Config.app_db_url);
