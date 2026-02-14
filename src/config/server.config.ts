import { Config } from './config';

export class ServerConfig extends Config {
  @Config.publish()
  @Config.env('DSPACE_REST_SSL')
  ssl: boolean;

  @Config.publish()
  @Config.env('DSPACE_REST_HOST')
  host: string;

  @Config.publish()
  @Config.env('DSPACE_REST_PORT', Number)
  port: number;

  @Config.publish()
  @Config.env('DSPACE_REST_NAMESPACE')
  nameSpace: string;

  @Config.publish()
  baseUrl?: string;

  @Config.env('DSPACE_REST_SSRBASEURL')
  ssrBaseUrl?: string;
  // This boolean will be automatically set on server startup based on whether "baseUrl" and "ssrBaseUrl"
  // have different values.
  hasSsrBaseUrl?: boolean;
}
