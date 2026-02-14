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

  private _baseUrl: string;
  @Config.publish()
  get baseUrl() {
    return this._baseUrl || [
      this.ssl ? 'https://' : 'http://',
      this.host,
      this.port && this.port !== 80 && this.port !== 443
        ? `:${this.port}`
        : '',
      this.nameSpace && this.nameSpace.startsWith('/')
        ? this.nameSpace
        : `/${this.nameSpace}`,
    ].join('');
  }
  set baseUrl(val: string) {
    this._baseUrl = val;
  }

  @Config.env('DSPACE_REST_SSRBASEURL')
  ssrBaseUrl?: string;

  // This boolean will be automatically set on server startup based on whether "baseUrl" and "ssrBaseUrl"
  // have different values.
  hasSsrBaseUrl?: boolean;
}
