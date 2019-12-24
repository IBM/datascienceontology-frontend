import * as _ from "lodash";
import * as React from "react";
import { Heading } from "react-bulma-components";

import * as Concept from "../interfaces/concept";
import { displayResponseData } from "../components/higher-order";
import { ConceptFullName } from "./concept";
import { apiUrl } from "../config";

export const ConceptIndexPage = (props: {}) => (
  <section id="concept-index">
    <Heading size={2}>Index of Concepts</Heading>
    <ConceptIndexRequest url={`${apiUrl}/concepts?short=true`} />
  </section>
);

const ConceptIndexDisplay = (props: { data?: Concept.Concept[] }) => {
  const index: { [key: string]: Concept.Concept[] } = {};
  (props.data || []).map(concept => {
    _.update(
      index,
      concept.name.charAt(0).toLowerCase(),
      (list: Concept.Concept[]) => {
        if (list === undefined) list = [];
        list.push(concept);
        return list;
      }
    );
  });
  return (
    <ul>
      {_.keys(index)
        .sort()
        .map(letter => (
          <li key={letter} className="has-margin-bottom-25">
            <Heading subtitle size={3}>
              <a id={letter} href={`#${letter}`} className="has-text-black">
                {letter.toUpperCase()}
              </a>
            </Heading>
            <ul>
              {index[letter].map(concept => (
                <li key={concept.id}>
                  <ConceptFullName concept={concept} />
                </li>
              ))}
            </ul>
          </li>
        ))}
    </ul>
  );
};
const ConceptIndexRequest = displayResponseData(ConceptIndexDisplay);
