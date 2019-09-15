import * as _ from "lodash";
import * as React from "react";
import { Heading } from "react-bulma-components";

import * as Annotation from "../interfaces/annotation";
import { displayResponseData } from "../components/higher-order";
import { AnnotationFullName } from "./annotation";
import { apiUrl } from "../config";


export const AnnotationIndexPage = (props: {}) =>
  <section id="annotation-index">
    <Heading size={2}>Index of Annotations</Heading>
    <AnnotationIndexRequest url={`${apiUrl}/annotations?short=true`} />
  </section>;


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
    <ul>
      {_.keys(index).sort().map(lang =>
        <li key={lang} className="has-margin-bottom-25">
          <Heading subtitle size={3}>
            <a id={`language-${lang}`} href={`#language-${lang}`}
               className="has-text-black">
              {_.upperFirst(lang)}
            </a>
          </Heading>
          <ul className="has-margin-left-50">
            {_.keys(index[lang]).sort().map(pkg =>
              <li key={pkg} className="has-margin-bottom-25">
                <Heading subtitle size={4}>
                  <a id={`package-${pkg}`} href={`#package-${pkg}`}
                     className="has-text-black">
                    {pkg}
                  </a>
                </Heading>
                <ul>
                  {index[lang][pkg].map(annotation =>
                    <li key={annotation.id}>
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