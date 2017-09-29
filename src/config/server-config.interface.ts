import { Config } from './config.interface';

export interface ServerConfig extends Config {
  ssl: boolean;
  host: string;
  port: number;
  nameSpace: string;
  baseUrl: string;
}
