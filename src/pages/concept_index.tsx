import * as _ from "lodash";
import * as React from "react";
import { Container, Heading } from "react-bulma-components";

import * as Concept from "../interfaces/concept";
import { displayResponseData } from "../components/higher-order";
import { ConceptFullName } from "./concept";
import { apiUrl } from "../config";


export const ConceptIndexPage = (props: {}) =>
  <Container>
    <section id="concept-index">
      <Heading size={2}>Index of Concepts</Heading>
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
    <ul>
      {_.keys(index).sort().map(letter => 
        <li className="has-margin-bottom-25">
          <Heading subtitle size={3}>
            <a id={letter} href={`#${letter}`} className="has-text-black">
              {letter.toUpperCase()}
            </a>
          </Heading>
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
