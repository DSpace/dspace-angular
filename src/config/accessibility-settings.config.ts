import { Config } from './config';

/**
 * Configuration interface used by the AccessibilitySettingsService
 */
export class AccessibilitySettingsConfig extends Config {
  /**
   * The duration in days after which the accessibility settings cookie expires
   */
  @Config.publish() cookieExpirationDuration: number;
}
