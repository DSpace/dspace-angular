import { Config } from '@dspace/config/config.interface';

/**
 * Configuration interface used by the LiveRegionService
 */
export class LiveRegionConfig implements Config {
  messageTimeOutDurationMs: number;
  isVisible: boolean;
}
