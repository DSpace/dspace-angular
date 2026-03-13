import {
  Config,
  toBoolean,
} from './config';
import { ServerConfig } from './server.config';

/**
 * Server configuration related to the UI.
 */
export class UIServerConfig extends ServerConfig {
  // rateLimiter is used to limit the amount of requests a user is allowed make in an amount of time, in order to prevent overloading the server
  @Config.public
  rateLimiter: {
    windowMs: number;
    limit: number;
    ipv6Subnet: number;
  } = {
      windowMs: 1 * 60 * 1000, // 1 minute
      limit: 500, // limit each IP to 500 requests per windowMs
      ipv6Subnet: 56, // IPv6 subnet mask applied to IPv6 addresses
    };

  // Trust X-FORWARDED-* headers from proxies
  @Config.public
  useProxies = true;

  @Config.public
  @Config.env('DSPACE_UI_SSL', toBoolean)
  ssl = false;

  @Config.public
  @Config.env('DSPACE_UI_HOST')
  host = 'localhost';

  @Config.public
  @Config.env('DSPACE_UI_PORT', Number)
  port = 4000;

  @Config.public
  @Config.env('DSPACE_UI_NAMESPACE')
  // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
  nameSpace = '/';
}
