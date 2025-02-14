import { Config } from './config.interface';

/**
 * Config related to the {@link MarkdownDirective}.
 */
export interface MarkdownConfig extends Config {

  /**
   * Enable Markdown (https://commonmark.org/) syntax for values passed to the {@link MarkdownDirective}.
   * - If this is true, values passed to the MarkdownDirective will be transformed to html according to the markdown syntax
   * rules.
   * - If this is false, using the MarkdownDirective will have no effect.
   */
  enabled: boolean;

  /**
   * Enable MathJax (https://www.mathjax.org/) syntax for values passed to the {@link MarkdownDirective}.
   * Requires {@link enabled} to also be true before MathJax will display.
   */
  mathjax: boolean;
}
