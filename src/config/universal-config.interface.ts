import { Config } from './config.interface';

export interface UniversalConfig extends Config {
  preboot: boolean;
  async: boolean;
  time: boolean;

  /**
   * Whether to inline "critical" styles into the server-side rendered HTML.
   *
   * Determining which styles are critical is a relatively expensive operation;
   * this option can be disabled to boost server performance at the expense of
   * loading smoothness.
   */
  inlineCriticalCss?: boolean;

  /**
   * Paths to enable SSR for. Defaults to the home page and paths in the sitemap.
   */
  paths: Array<string>;
  /**
   * Whether to enable rendering of search component on SSR
   */
  enableSearchComponent: boolean;

  /**
   * Whether to enable rendering of browse component on SSR
   */
  enableBrowseComponent: boolean;
}
