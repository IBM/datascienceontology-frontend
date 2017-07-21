import * as React from "react";

import * as Services from "../services";
import { CytoscapeComponent } from "../components/cytoscape";


const elements = [
  { data: { id: 'a' } },
  { data: { id: 'b' } },
  {
    data: {
      id: 'ab',
      source: 'a',
      target: 'b'
    }
  }
]

export const DiagramPage = () =>
  <section className="diagram">
    <CytoscapeComponent elements={elements} />
  </section>;
