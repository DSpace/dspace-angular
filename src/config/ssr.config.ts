import { Config } from './config';

export interface SsrExcludePatterns {
  pattern: string | RegExp;
  flag?: string;
}

export class SSRConfig extends Config {
  /**
   * A boolean flag indicating whether the SSR configuration is enabled
   * Defaults to true.
   */
  @Config.public enabled = false;

  /**
   * Enable request performance profiling data collection and printing the results in the server console.
   * Defaults to false.
   */
  enablePerformanceProfiler = false;

  /**
   * When set to true, reduce render blocking requests by inlining critical CSS.
   * Determining which styles are critical can be an expensive operation;
   * this option can be disabled to boost server performance at the expense of loading smoothness.
   * For improved SSR performance, DSpace defaults this to false (disabled).
   */
  @Config.public inlineCriticalCss = false;

  /**
   * Enable state transfer from the server-side application to the client-side application.
   * Defaults to true.
   *
   * Note: When using an external application cache layer, it's recommended not to transfer the state to avoid caching it.
   * Disabling it ensures that dynamic state information is not inadvertently cached, which can improve security and
   * ensure that users always use the most up-to-date state.
   */
  @Config.public transferState = true;

  /**
   * When a different REST base URL is used for the server-side application, the generated state contains references to
   * REST resources with the internal URL configured. By default, these internal URLs are replaced with public URLs.
   * Disable this setting to avoid URL replacement during SSR. In this the state is not transferred to avoid security issues.
   */
  replaceRestUrl = true;

  /**
   * Patterns to be used as regexes to match url's path and check if SSR is disabled for it.
   */
  @Config.public excludePathPatterns:  SsrExcludePatterns[] = [
    {
      pattern: '^/communities/[a-f0-9-]{36}/browse(/.*)?$',
      flag: 'i',
    },
    {
      pattern: '^/collections/[a-f0-9-]{36}/browse(/.*)?$',
      flag: 'i',
    },
    { pattern: '^/browse/' },
    { pattern: '^/search' },
    { pattern: '^/community-list$' },
    { pattern: '^/statistics/?' },
    { pattern: '^/admin/' },
    { pattern: '^/processes/?' },
    { pattern: '^/notifications/' },
    { pattern: '^/access-control/' },
    { pattern: '^/health$' },
  ];

  /**
   * Whether to enable rendering of search component on SSR
   */
  @Config.public enableSearchComponent = false;

  /**
   * Whether to enable rendering of browse component on SSR
   */
  @Config.public enableBrowseComponent = false;
}
