import * as RemarkParse from 'remark-parse';
import { UNIST } from 'unist';


/** Inline or block extension node.
 */
export interface ExtensionNode extends UNIST.Node {
  /* Content of extension. */
  content?: string;
  
  /* Argument of extension. */
  value?: string;
}


/** Remark plugin for proposed generic extension directive in Commonmark. 

  A simplified variant of the package by Mehdi Lahlou:
  <https://github.com/medfreeman/remark-generic-extensions>
  
  Unlike the original package, this function
  - returns MDAST nodes, not HAST nodes
  - does not support key-value properties
  - is compatible with the react-markdown package
 */
export function remarkGenericExtensions(options: {}) {
  const Remark: RemarkParse = this;
  const Parser = Remark.Parser;
  
  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.extension = inlineExtensionTokenizer;
  inlineMethods.splice(inlineMethods.indexOf("text"), 0, "extension");
    
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.extension = blockExtensionTokenizer;
  blockMethods.splice(blockMethods.indexOf("paragraph"), 0, "extension");
}


const inlineExtensionTokenizer: RemarkParse.Tokenizer = (eat, value, silent) => {
  const match = inlineExtensionRegex.exec(value);
  if (match) {
    if (silent) return true;
    if (match[4]) throw new Error("Key-value properties are not supported");
    const node: ExtensionNode = {
      type: match[1],
      content: match[2] ? match[2] : undefined,
      value: match[3] ? match[3] : undefined,
    };
    return eat(match[0])(node);
  }
};
inlineExtensionTokenizer.locator = (value, fromIndex) => value.indexOf("!", fromIndex);
inlineExtensionTokenizer.notInLink = true;

const blockExtensionTokenizer: RemarkParse.Tokenizer = (eat, value, silent) => {
  const match = blockExtensionRegex.exec(value);
  if (match) {
    if (silent) return true;
    if (match[4]) throw new Error("Key-value properties are not supported");
    const node: ExtensionNode = {
      type: match[1],
      content: match[2] ? match[2] : undefined,
      value: match[3],
    };
    return eat(match[0])(node);
  }
}

const inlineExtensionRegex = /^!(\w+)(?:\[([^)]*)\])?(?:\(([^)]*)\))?(?:\{([^}]*)\})?/;
const blockExtensionRegex = /^(\w+):(?:(?:[ \t]+)([^\f\n\r\v]*))?(?:[\f\n\r\v]+):::([^]*?):::(?:(?:[\f\n\r\v]+)(?:\{([^}]*)\}))?/;
