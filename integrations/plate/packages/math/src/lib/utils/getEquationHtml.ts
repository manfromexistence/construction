import katex, { type KatexOptions } from "katex";
import type { TEquationElement } from "platejs";

export const getEquationHtml = ({
  element,
  options,
}: {
  element: TEquationElement;
  options?: KatexOptions;
}) => katex.renderToString(element.texExpression, options);
