import * as React from "react";

import {
  Diagrams,
  Graphviz,
  WiringDiagramCanvas,
  copyDiagramLayoutProperties,
  mergeDiagramLayout,
  parseGraphvizLayout
} from "wiring-diagram-canvas";
import { displayResponseData } from "./higher-order";

interface WiringDiagramProps {
  diagram: Diagrams.WiringDiagram;
  graphviz?: Graphviz.Graph;
}

export const WiringDiagramComponent = (props: WiringDiagramProps) => {
  const diagram = props.diagram;
  copyDiagramLayoutProperties(diagram);
  if (props.graphviz) {
    const layout = parseGraphvizLayout(props.graphviz);
    mergeDiagramLayout(diagram, layout);
  }
  return <WiringDiagramCanvas diagram={diagram} />;
};

const WiringDiagramDocumentInner = (props: { data?: WiringDiagramProps }) => {
  return props.data && <WiringDiagramComponent {...props.data} />;
};
export const WiringDiagramDocument = displayResponseData(
  WiringDiagramDocumentInner
);
