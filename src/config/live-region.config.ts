import { Config } from './config';

/**
 * Configuration interface used by the LiveRegionService
 */
export class LiveRegionConfig extends Config {
  @Config.public messageTimeOutDurationMs = 30000;
  @Config.public isVisible = false;
}
