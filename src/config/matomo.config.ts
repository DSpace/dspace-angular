import { Config } from './config';

/**
 * Configuration interface for Matomo tracking
 */
export class MatomoConfig extends Config {
  /**
   * This tracker url will be used instead of the one configured on REST side (matomo.tracker.url)
   * only if set inside the config.*.yml configuration file
   */
  @Config.publish() trackerUrl?: string;
}
