import { Config } from './config.interface';

/**
 * Configuration interface for AddToAny plugin to display social links
 */
export interface AddToAnyPluginConfig extends Config {
  /**
   * Script URL to AddToAny plugin, defaults to AddToAny CDN
   */
  scriptUrl: string;
  /**
   * Enable feature flag
   */
  socialNetworksEnabled: boolean;
  /**
   * Mandatory parameter for AddToAny(data-a2a-title). It will be included as part of social link share
   */
  title: string;
  /**
   * Listed elements will be rendered with their respective icon
   * List of the integrations, you can check these at https://www.addtoany.com/buttons/for/website
   */
  buttons: string[];
  /**
   * Shows plus button which allows to share with different integrations which were not listed in buttons
   */
  showPlusButton: boolean;
  /**
   * Shows counter for the integration https://www.addtoany.com/buttons/customize/share_counters where it is allowed
   */
  showCounters: boolean;
}
