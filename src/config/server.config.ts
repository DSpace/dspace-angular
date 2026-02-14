import {
  Config,
  toBoolean,
} from './config';

export class ServerConfig extends Config {
  @Config.public
  @Config.env('DSPACE_REST_SSL', toBoolean)
  ssl = false;

  @Config.public
  @Config.env('DSPACE_REST_HOST')
  host = 'localhost';

  @Config.public
  @Config.env('DSPACE_REST_PORT', Number)
  port = 8080;

  @Config.public
  @Config.env('DSPACE_REST_NAMESPACE')
  nameSpace = '/';

  private _baseUrl: string;
  @Config.public
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
  ssrBaseUrl: string = undefined;
}
