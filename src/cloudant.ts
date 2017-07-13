/** Request data for Cloudant Search API.
  
  Warning: The interface here is not complete. For complete options, see
    https://docs.cloudant.com/search.html
 */
export interface SearchRequest {
  /* Lucene query to run. */
  query: string;
  
  /* Limit the number of the returned documents to the specified number. */
  limit?: number;
  
  /* Include the full content of the documents in the response. [default: no] */
  include_docs?: boolean;
  
  /* Fields to include in search results. Any included field must be indexed
    with the store:true ption. [default: all]
   */
  include_fields?: Array<string>;
  
  /* Bookmark to page through results from previous request. */
  bookmark?: string;
  
  /* The sort order of the results. */
  sort?: string;
}

/** Response from Cloudant Search API.
 */
export interface SearchResponse<Content extends {} = {}> {
  /* Total number of rows. */
  total_rows: number;
  
  /* Rows included this response. */
  rows: Array<SearchResponseRow<Content>>;
  
  /* Bookmark to page through additional results. */
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

/* Make a request to the Cloudant Search API.

  Not supported by vanilla CouchDB or PouchDB.
 */
export function search<Content extends {} = {}>(
    endpoint: string, data: SearchRequest): Promise<SearchResponse<Content>> {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(response => response.json() as Promise<SearchResponse<Content>>);
}
