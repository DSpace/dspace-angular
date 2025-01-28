import { Config } from './config.interface';

export interface SSRConfig extends Config {
  /**
   * A boolean flag indicating whether the SSR configuration is enabled
   * Defaults to true.
   */
  enabled: boolean;

  /**
   * Enable request performance profiling data collection and printing the results in the server console.
   * Defaults to false.
   */
  enablePerformanceProfiler: boolean;

  /**
   * When set to true, reduce render blocking requests by inlining critical CSS.
   * Determining which styles are critical can be an expensive operation;
   * this option can be disabled to boost server performance at the expense of loading smoothness.
   * For improved SSR performance, DSpace defaults this to false (disabled).
   */
  inlineCriticalCss: boolean;

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
