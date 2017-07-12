import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';

export interface GlobalConfig {
  ui: ServerConfig;
  rest: ServerConfig;
  prerenderStrategy: string;
  production: boolean;
  cache: CacheConfig;
  logDirectory: string;
  debug: boolean;
}
