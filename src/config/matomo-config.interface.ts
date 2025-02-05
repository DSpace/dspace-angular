import { Config } from './config.interface';

/**
 * Configuration interface for Matomo tracking
 */
export interface MatomoConfig extends Config {
  trackerUrl?: string;
  siteId?: string;
}
