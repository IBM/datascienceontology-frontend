/** Response from Cloudant Search API.

  Not supported by vanilla CouchDB or PouchDB.
 */
export interface SearchResponse<Content extends {} = {}> {
  /* Total number of rows. */
  total_rows: number;
  
  /* Rows included this response. */
  rows: Array<SearchResponseRow<Content>>;
  
  /* Bookmark to page through additional rows. */
  bookmark: string;
  
  /* Facet results. */
  counts?: any;  
  ranges?: any;
}

/** Individual row in response from Cloudant Search API.
 */
export interface SearchResponseRow<Content extends {} = {}> {
  /* ID of document in database. */
  id: string;
  
  /* Lucene relevance score or sort parameter if sorting is enabled. */
  order: Array<number>;
  
  /* Stored fields for document, determined by the search index. */
  fields: Content;
}
