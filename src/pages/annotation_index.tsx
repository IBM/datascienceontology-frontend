import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";

import * as Annotation from "../interfaces/annotation";
import { displayResponseData } from "open-discovery-components";
import { AnnotationFullName } from "./annotation";
import { apiUrl } from "../config";

import "../../style/pages/annotation_index.css";


export const AnnotationIndexPage = (props: {}) =>
  <Container>
    <section id="annotations">
      <h1>Index of Annotations</h1>
      <AnnotationIndexRequest url={`${apiUrl}/annotations?short=true`} />
    </section>
  </Container>;


const AnnotationIndexDisplay = (props: {data?: Annotation.Annotation[]}) => {
  const index: { [lang: string]: { [pkg: string]: 
    Annotation.Annotation[] }} = {};
  (props.data || []).map(note => {
    _.update(index, [note.language, note.package],
      (list: Annotation.Annotation[]) => {
        if (list === undefined) list = [];
        list.push(note);
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
const AnnotationIndexRequest = displayResponseData(AnnotationIndexDisplay);