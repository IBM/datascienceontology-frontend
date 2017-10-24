import * as React from "react";
import cytoscape = require("cytoscape");

import { Cytoscape } from "open-discovery";


/** React componet wrapping Cytoscape.js.

  Inspired by https://github.com/cytoscape/cytoscape.js/issues/1468
 */
export class CytoscapeComponent extends React.Component<Cytoscape.Cytoscape,{}> {
  private _cy: any;
  
  get cy(): any {
    return this._cy;
  }
  
  componentDidMount() {
    const opts = Object.assign({}, this.props, {container: this.refs.cy});
    this._cy = cytoscape(opts);
  }
  
  componentWillReceiveProps(nextProps: Cytoscape.Cytoscape) {
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
