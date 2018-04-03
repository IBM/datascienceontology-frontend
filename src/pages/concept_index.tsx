import * as _ from "lodash";
import * as React from "react";
import * as Router from "react-router-dom";
import { Container } from "reactstrap";

import { Concept } from "open-discovery";
import { displayCouchQuery } from "open-discovery-components";
import { ConceptFullName } from "./concept";
import * as Config from "../config";

import "../../style/pages/concept_index.css";


export const ConceptIndexPage = (props: {}) =>
  <Container>
    <section id="concepts">
      <h1>Index of concepts</h1>
      <ConceptIndex/>
    </section>
  </Container>;


const ConceptIndexDisplay = (props: {docs?: Concept.Concept[]}) => {
  const index: {[key: string]: Concept.Concept[]} = {};
  (props.docs || []).map(doc => {
    _.update(index, doc.name.charAt(0).toLowerCase(),
      (list: Concept.Concept[]) => {
        if (list === undefined) list = [];
        list.push(doc);
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
const ConceptIndexQuery = displayCouchQuery(ConceptIndexDisplay);

export const ConceptIndex = (props: {}) =>
  <ConceptIndexQuery dbURL={Config.dbURL} dbName={Config.dbName} options={{
    selector: {
      schema: "concept",
    },
    fields: ["id", "name", "kind"],
  }} />;
