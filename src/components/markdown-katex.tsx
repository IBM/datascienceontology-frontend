import * as React from "react";
import { KatexOptions } from "katex";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";

import { KaTeXMath } from "./katex";

/** Render Markdown with KaTeX support.
 */
export const ReactMarkdownKaTeX = (props: ReactMarkdown.ReactMarkdownProps) => {
  const newProps = {
    ...props,
    plugins: [...((props.plugins as any[]) || []), remarkMath],
    renderers: {
      ...props.renderers,
      math: (props: { value: string }) => (
        <KaTeXMath display options={{ throwOnError: false } as KatexOptions}>
          {props.value}
        </KaTeXMath>
      ),
      inlineMath: (props: { value: string }) => (
        <KaTeXMath options={{ throwOnError: false } as KatexOptions}>
          {props.value}
        </KaTeXMath>
      )
    }
  };
  return <ReactMarkdown {...newProps} />;
};
