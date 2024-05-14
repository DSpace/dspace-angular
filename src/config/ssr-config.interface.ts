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
   * Reduce render blocking requests by inlining critical CSS.
   * Defaults to true.
   */
  inlineCriticalCss: boolean;
}
