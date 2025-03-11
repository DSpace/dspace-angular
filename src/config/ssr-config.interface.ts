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
   * Enable state transfer from the server-side application to the client-side application.
   * Defaults to true.
   *
   * Note: When using an external application cache layer, it's recommended not to transfer the state to avoid caching it.
   * Disabling it ensures that dynamic state information is not inadvertently cached, which can improve security and
   * ensure that users always use the most up-to-date state.
   */
  transferState: boolean;

  /**
   * When a different REST base URL is used for the server-side application, the generated state contains references to
   * REST resources with the internal URL configured. By default, these internal URLs are replaced with public URLs.
   * Disable this setting to avoid URL replacement during SSR. In this the state is not transferred to avoid security issues.
   */
  replaceRestUrl: boolean;

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
