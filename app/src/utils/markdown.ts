/**
 * Converts LaTeX math delimiters in Markdown to formats
 * recognized by MathJax. Inline `$...$` expressions become
 * `\(...\)` and block `$$...$$` become `\[...\]`.
 *
 * @param text - Markdown string potentially containing LaTeX.
 * @returns Updated Markdown string ready for MathJax typesetting.
 */
export function applyMathJaxDelimiters(text: string): string {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, '\\[$1\\]')
    .replace(/\$(?!\$)([^$]+)\$/g, '\\($1\\)');
}
