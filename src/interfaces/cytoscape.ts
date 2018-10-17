/** Cytoscape initialization data.
   
  Reference: <http://js.cytoscape.org/#core/initialisation>
 */
export interface Cytoscape {
  /* HTML DOM element in which to render the graph. */
  container?: HTMLElement;
  
  /* Cytoscape elements. */
  elements?: Element[];
  
  /* The stylesheet used to style the graph. */
  style?: string | Style[];
  
  /* Layout options. */
  layout?: Layout;
  
  /* Initial viewport state. */
  zoom?: number;
  pan?: {
    x: number,
    y: number,
  }
  
  /* Interaction options. */
  minZoom?: number;
  maxZoom?: number;
  zoomingEnabled?: boolean;
  userZoomingEnabled?: boolean;
  panningEnabled?: boolean,
  userPanningEnabled?: boolean,
  boxSelectionEnabled?: boolean,
  selectionType?: string;
  touchTapThreshold?: number;
  desktopTapThreshold?: number;
  autolock?: boolean;
  autoungrabify?: boolean;
  autounselectify?: boolean;
  
  /* Rendering options. */
  headless?: boolean;
  styleEnabled?: boolean;
  hideEdgesOnViewport?: boolean;
  hideLabelsOnViewport?: boolean;
  textureOnViewport?: boolean;
  motionBlur?: boolean;
  motionBlurOpacity?: number
  wheelSensitivity?: number;
  pixelRatio?: number | string;
}

/** Cytoscape element: node or edge.

  Reference: <http://js.cytoscape.org/#notation/elements-json>
 */
export interface Element {
  /* Kind of element: "node" or "edge". */
  group?: string;
  
  /* Space-separated list of classes element belongs to. */
  classes?: string;
  
  /* Element data */
  data: ElementData;
  
  /* "Scratchpad data" that is temporary or non-serializable. */
  scratch?: {};

  /* Position of node (specifically, the center of the node). */
  position?: {
    x: number,
    y: number,
  }
}

export interface ElementData {
  /* ID of element, assigned by Cytoscape if undefined. */
  id?: ElementID;
  
  /* Source of edge. Not defined for nodes. */
  source?: ElementID;
  
  /* Target of edge. Not defined for nodes. */
  target?: ElementID;
  
  /* Parent of element, if a compound node. */
  parent?: ElementID;
  
  /* Other JSON-serializable data, not consumed by Cytoscape. */
  [other: string]: any;
}

export type ElementID = number | string;

/** Cytoscape layout.

  Reference: <http://js.cytoscape.org/#layouts>
 */
export interface Layout {
  /* Name of layout. */
  name: string;

  /* Layout-specific options. */
  [key: string]: any;
}

/** Cytoscape style for node and edges.

  Reference: <http://js.cytoscape.org/#style/format>
 */
export interface Style {
  /** Style selector ala CSS.
  
    Reference: <http://js.cytoscape.org/#selectors>
  */
  selector: string;
  
  /* Style key-value pairs. */
  style: StyleData;
}

export interface StyleData {
  [key: string]: any;
}
