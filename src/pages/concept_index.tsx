import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";

import * as Concept from "../interfaces/concept";
import { displayResponseData } from "open-discovery-components";
import { ConceptFullName } from "./concept";
import { apiUrl } from "../config";

import "../../style/pages/concept_index.css";


export const ConceptIndexPage = (props: {}) =>
  <Container>
    <section id="concepts">
      <h1>Index of Concepts</h1>
      <ConceptIndexRequest url={`${apiUrl}/concepts?short=true`} />
    </section>
  </Container>;


const ConceptIndexDisplay = (props: {data?: Concept.Concept[]}) => {
  const index: {[key: string]: Concept.Concept[]} = {};
  (props.data || []).map(concept => {
    _.update(index, concept.name.charAt(0).toLowerCase(),
      (list: Concept.Concept[]) => {
        if (list === undefined) list = [];
        list.push(concept);
        return list;
      });
  });
  return (
    <ul id="concept-index">
      {_.keys(index).sort().map(letter => 
        <li>
          <h2>
            <a id={letter} href={`#${letter}`}>
              {letter.toUpperCase()}
            </a>
          </h2>
          <ul>
            {index[letter].map(concept => 
              <li>
                <ConceptFullName concept={concept} />
              </li>
            )}
          </ul>
        </li>
      )}
    </ul>
  );
}
const ConceptIndexRequest = displayResponseData(ConceptIndexDisplay);
