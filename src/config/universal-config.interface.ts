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
   * REST resources with the internal URL configured, so it is not transferred to the client application, by default.
   * Enabling this setting transfers the state to the client application and replaces internal URLs with the public
   * URLs used by the client application.
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
