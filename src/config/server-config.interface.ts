import { Config } from './config.interface';

export class ServerConfig implements Config {
  constructor(
  public ssl: boolean,
  public host: string,
  public port: number,
  public nameSpace: string) {}

  get baseUrl(): string {
    if (this.host) {
      return [
        getProtocol(this.ssl),
        getHost(this.host),
        getPort(this.port),
        getNameSpace(this.nameSpace)
      ].join('');
    } else {
      return '';
    }
  }
}

function getProtocol(ssl: boolean): string {
  return ssl ? 'https://' : 'http://';
}

function getHost(host: string): string {
  return host;
}

function getPort(port: number): string {
  return port ? (port !== 80 && port !== 443) ? ':' + port : '' : '';
}

function getNameSpace(nameSpace: string): string {
  return nameSpace ? nameSpace.charAt(0) === '/' ? nameSpace : '/' + nameSpace : '';
}

function isDefined(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
