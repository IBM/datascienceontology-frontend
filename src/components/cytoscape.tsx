import * as React from "react";
import cytoscape = require("cytoscape");

import * as Cytoscape from "../interfaces/cytoscape";


interface CytoscapeData {
  cytoscape: Cytoscape.Cytoscape;
  width?: string;
  height?: string;
}

/** React component wrapping Cytoscape.js.

  See GitHub issue discussing React wrappers for Cytoscape:
  <https://github.com/cytoscape/cytoscape.js/issues/1468>

  The Cytoscape instance is completely re-created when the props change.
  Therefore, this component should not be used if many small, incremental
  updates must be made to the Cytoscape elements data.
 */
export class CytoscapeComponent extends React.Component<CytoscapeData> {
  private _cy: any;
  private _container: HTMLDivElement;

  get cytoscape() {
    return this._cy;
  }

  createCytoscape() {
    this._cy = cytoscape({
      ...this.props.cytoscape,
      container: this._container,
    });
  }
  
  componentDidMount() {
    this.createCytoscape();
  }
  componentWillUpdate() {
    this._cy.destroy();
  }
  componentDidUpdate() {
    this.createCytoscape();
  }
  componentWillUnmount() {
    this._cy.destroy();
  }
  
  render() {
    return <div className="cytoscape-container"
      ref={(elem) => { this._container = elem; }}
      style={{
        width: this.props.width || "100%",
        height: this.props.height || "100%",
      }}
    />;
  }
}


interface CytoscapeDocumentProps {
  /* URL of Cytoscape document to render. */
  docURL: string;

  /* Default Cytoscape data.
  
  Useful for setting Cytoscape initialization options and styles.
  */
  defaults?: Cytoscape.Cytoscape;
}

interface CytoscapeDocumentState {
  /* Cytoscape document to render. */
  doc: CytoscapeData

  /* Error status. */
  ok: boolean;
}

/** Render remote Cytoscape data in JSON format.
 */
export class CytoscapeDocument
  extends React.Component<CytoscapeDocumentProps,CytoscapeDocumentState> {
  
  private _cy: any;
  private _container: HTMLDivElement;
  
  constructor(props: CytoscapeDocumentProps) {
    super(props);
    this.state = { doc: null, ok: true };
  }

  get cytoscape() {
    return this._cy;
  }

  createCytoscape() {
    const doc = this.state.doc;
    if (doc) {
      this._cy = cytoscape({
        ...doc.cytoscape,
        container: this._container,
      });
    }
  }

  cleanupCytoscape() {
    if (this._cy) {
      this._cy.destroy();
      this._cy = null;
    }
  }

  loadDocument(docURL: string) {
    fetch(docURL).then(response => {
      if (response.ok) {
        response.json().then(body => {
          const doc: CytoscapeData = {
            ...body,
            cytoscape: {
              ...this.props.defaults,
              ...body.cytoscape,
            }
          }
          this.setState({ doc: doc, ok: true });
        });
      } else {
        this.setState({ doc: null, ok: false });
      }
    });
  }

  componentWillMount() {
    this.loadDocument(this.props.docURL);
  }
  componentWillReceiveProps(nextProps: CytoscapeDocumentProps) {
    if (this.props.docURL != nextProps.docURL) {
      this.loadDocument(nextProps.docURL);
    }
  }
  componentWillUpdate() {
    this.cleanupCytoscape();
  }
  componentDidUpdate() {
    this.createCytoscape();
  }
  componentWillUnmount() {
    this.cleanupCytoscape();
  }

  render() {
    if (!this.state.ok) {
      return <p>Error fetching Cytoscape data</p>;
    }
    const doc = this.state.doc;
    return doc && <div className="cytoscape-container"
      ref={(elem) => { this._container = elem; }}
      style={{
        width: doc.width || "100%",
        height: doc.height || "100%",
      }}
    />;
  }
}
