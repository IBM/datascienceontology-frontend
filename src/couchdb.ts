import { FetchCouchDB } from "open-discovery-components";

// CouchDB deployment: origin of URL.
const dbOrigin = "***REMOVED***";

// Database: Data Science Ontology.
const dbName = "data-science-ontology";

// Database: web app for Data Science Ontology.
const webappDbName = "data-science-ontology-webapp";

// CouchDB clients.
export const client = new FetchCouchDB(`${dbOrigin}/${dbName}`);
export const webappClient = new FetchCouchDB(`${dbOrigin}/${webappDbName}`);
