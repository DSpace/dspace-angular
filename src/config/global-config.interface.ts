import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  universal: UniversalConfig;
  logDirectory: string;
  prerenderStrategy: string;
  debug: boolean;
}
