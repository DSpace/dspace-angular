import { Config } from './config';
import { ServerConfig } from './server.config';

/**
 * Server configuration related to the UI.
 */
export class UIServerConfig extends ServerConfig {
  // rateLimiter is used to limit the amount of requests a user is allowed make in an amount of time, in order to prevent overloading the server
  @Config.publish()
  rateLimiter?: {
    windowMs: number;
    limit: number;
    ipv6Subnet: number;
  };

  // Trust X-FORWARDED-* headers from proxies
  @Config.publish()
  useProxies: boolean;

  @Config.publish()
  @Config.env('DSPACE_SSL')
  ssl: boolean;

  @Config.publish()
  @Config.env('DSPACE_HOST')
  host: string;

  @Config.publish()
  @Config.env('DSPACE_PORT', Number)
  port: number;

  @Config.publish()
  @Config.env('DSPACE_NAMESPACE')
  nameSpace: string;
}
