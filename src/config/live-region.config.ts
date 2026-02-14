import { Config } from './config';

/**
 * Configuration interface used by the LiveRegionService
 */
export class LiveRegionConfig extends Config {
  @Config.publish() messageTimeOutDurationMs: number;
  @Config.publish() isVisible: boolean;
}
