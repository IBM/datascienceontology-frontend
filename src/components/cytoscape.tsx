import * as React from "react";
import cytoscape = require("cytoscape");


interface CytoscapeProps {
  elements?: Array<{}>;
  style?: string | Array<{}>;
  layout?: {};
}

/** React componet wrapping Cytoscape.js.

  Inspired by https://github.com/cytoscape/cytoscape.js/issues/1468
 */
export class CytoscapeComponent extends React.Component<CytoscapeProps,{}> {
  private _cy: any;
  
  get cy(): any {
    return this._cy;
  }
  
  componentDidMount() {
    const opts = Object.assign({}, this.props, {container: this.refs.cy});
    this._cy = cytoscape(opts);
  }
  
  componentWillReceiveProps(nextProps: CytoscapeProps) {
    this._cy.json(nextProps);
  }

  componentWillUnmount() {
    this._cy.destroy();
  }
  
  render() {
    // By default, height is zero? FIXME: Do not hard code.
    return <div className="cytoscape-container" ref="cy" 
                style={{height: "400px"}}/>;
  }
}
