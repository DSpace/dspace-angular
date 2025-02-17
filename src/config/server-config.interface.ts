import { Config } from './config.interface';

export class ServerConfig implements Config {
  public ssl: boolean;
  public host: string;
  public port: number;
  public nameSpace: string;
  public baseUrl?: string;
  public ssrBaseUrl?: string;
  // This boolean will be automatically set on server startup based on whether "baseUrl" and "ssrBaseUrl"
  // have different values.
  public hasSsrBaseUrl?: boolean;
}
