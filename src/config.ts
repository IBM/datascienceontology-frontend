export const apiUrl =
  process.env.NODE_ENV == "development"
    ? process.env.REACT_APP_ONTOLOGY_API || ""
    : "https://api.datascienceontology.org";
