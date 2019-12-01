# Frontend for Data Science Ontology

This repository contains the web frontend for the Data Science Ontology, written
in TypeScript and React.

The Data Science Ontology itself lives in its own
[repository](https://github.com/ibm/datascienceontology).

To run, install dependencies with `yarn` and use `npm run serve`. Note that
the frontend is hard-coded to call `api.datascienceontology.org` which has no
CORS header for `localhost`, so data may not load.
