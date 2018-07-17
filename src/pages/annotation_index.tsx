import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";

import { Annotation } from "open-discovery";
import { displayCouchQuery } from "open-discovery-components";
import { AnnotationFullName } from "./annotation";
import * as Config from "../config";

import "../../style/pages/annotation_index.css";


export const AnnotationIndexPage = (props: {}) =>
  <Container>
    <section id="annotations">
      <h1>Index of Annotations</h1>
      <AnnotationIndex/>
    </section>
  </Container>;

export const AnnotationIndex = (props: {}) =>
  <AnnotationIndexQuery dbURL={Config.dbURL} dbName={Config.dbName} options={{
    selector: {
      schema: "annotation",
    },
    fields: ["language", "package", "id", "name", "kind"],
  }} />;


const AnnotationIndexDisplay = (props: {docs?: Annotation.Annotation[]}) => {
  const index: { [lang: string]: { [pkg: string]: 
    Annotation.Annotation[] }} = {};
  (props.docs || []).map(doc => {
    _.update(index, [doc.language,doc.package],
      (list: Annotation.Annotation[]) => {
        if (list === undefined) list = [];
        list.push(doc);
        return list;
      });
  });
  return (
    <ul id="annotation-index">
      {_.keys(index).sort().map(lang =>
        <li>
          <h3>
            <a id={`language-${lang}`} href={`#language-${lang}`}>
              {_.upperFirst(lang)}
            </a>
          </h3>
          <ul>
            {_.keys(index[lang]).sort().map(pkg =>
              <li>
                <h4>
                  <a id={`package-${pkg}`} href={`#package-${pkg}`}>
                    {pkg}
                  </a>
                </h4>
                <ul>
                  {index[lang][pkg].map(annotation =>
                    <li>
                     <AnnotationFullName annotation={annotation} />
                    </li>
                  )}
                </ul>
              </li>
            )}
          </ul>
        </li>
      )}
    </ul>
  );
}
const AnnotationIndexQuery = displayCouchQuery(AnnotationIndexDisplay);