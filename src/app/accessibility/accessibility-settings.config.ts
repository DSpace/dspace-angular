import { Config } from '../../config/config.interface';

/**
 * Configuration interface used by the AccessibilitySettingsService
 */
export class AccessibilitySettingsConfig implements Config {
  /**
   * The duration in days after which the accessibility settings cookie expires
   */
  cookieExpirationDuration: number;
}
