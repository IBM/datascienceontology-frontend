import * as _ from "lodash";
import * as React from "react";

import { UNIST } from "unist";
import searchHeadings = require("mdast-util-toc/lib/search");


interface TableOfContentsItem {
  id: string,
  depth: number,
  value: string,
}
export type TableOfContents = TableOfContentsItem[];

/** Remark AST plugin to extract a table of contents from headings.
  
  All the work is done by the "search" function in the "mdast-util-toc" 
  package. This package is used to implement the better known "remark-toc"
  package. We don't use "remark-toc" because it isn't compatible with
  react-markdown (for many reasons) and because we want to separate the
  parsing and rendering stages.

  See issues on GitHub:
  https://github.com/rexxars/react-markdown/issues/48
  https://github.com/rexxars/react-markdown/issues/188
 */ 
export function remarkTableOfContents(
    callback: (toc: TableOfContents) => void, maxDepth: number) {
  return function (tree: UNIST.Node) {
    const result = searchHeadings(tree, null, maxDepth);
    callback(result.map);
    return tree;
  }
}


interface TableOfContentsNode {
  id: string,
  value: string,
  children: TableOfContentsNode[],
}

/** Convert a table of contents from list form to tree form.
 */
function tableOfContentsTree(toc: TableOfContents): TableOfContentsNode {
  const root: TableOfContentsNode = { id: null, value: null, children: [] };
  const stack = [ { node: root, depth: 0 } ];
  toc.map(item => {
    const { id, value } = item;
    const itemNode: TableOfContentsNode = { id, value, children: [] };
    let { node, depth } = _.last(stack);   

    // Move up the stack until the new node's depth exceeds the depth at the
    // top of the stack.
    while (item.depth <= depth) {
      stack.pop();
      ({ node, depth } = _.last(stack));
    }

    // Add the new node as a child of the node at the top of the stack.
    node.children.push(itemNode);
    stack.push({ node: itemNode, depth: item.depth });
  });
  return root;
}


interface TableOfContentsProps {
  children: TableOfContents
}

/** Render table of contents as a nested, ordered list.
 */
export const ReactTableOfContents = (props: TableOfContentsProps) => {
  const tree = tableOfContentsTree(props.children);

  function renderNode(node: TableOfContentsNode, key: number): JSX.Element {
    return <li key={key}>
      <a href={`#${node.id}`}>{node.value}</a>
      {_.isEmpty(node.children) ? null : <ol>
        {node.children.map(renderNode)}
      </ol>}
    </li>;
  }

  return <div className="table-of-contents">
    <ol>
      {tree.children.map(renderNode)}
    </ol>
  </div>;
};

