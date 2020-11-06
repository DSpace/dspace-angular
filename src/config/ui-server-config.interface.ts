import { ServerConfig } from './server-config.interface';

/**
 * Server configuration related to the UI.
 */
export class UIServerConfig extends ServerConfig {

  // rateLimiter is used to reduce the amount consequential hits and add a delay
  rateLimiter?: {
    windowMs: number;
    max: number;
  };

}
