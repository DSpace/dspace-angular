import { RawBootstrapResponse } from '../app/core/dspace-rest/raw-rest-response.model';
import { Config } from './config.interface';

export interface PrefetchConfig extends Config {
  /**
   * The URLs that should be pre-fetched
   */
  urls: string[];
  /**
   * A mapping of URL to response
   * bootstrap values should not be set manually, they will be overwritten.
   */
  bootstrap: Record<string, RawBootstrapResponse>;
  /**
   * How often the responses should be refreshed in milliseconds
   */
  refreshInterval: number;
}
