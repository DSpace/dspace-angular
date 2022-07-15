import { ServerConfig } from './server-config.interface';

/**
 * Server configuration related to the UI.
 */
export class UIServerConfig extends ServerConfig {

  // rateLimiter is used to limit the amount of requests a user is allowed make in an amount of time, in order to prevent overloading the server
  rateLimiter?: {
    windowMs: number;
    max: number;
  };
  // this sets the protocol to HTTPS when the complete URL is needed in the UI
  forceHTTPSInOrigin?: boolean;
}
