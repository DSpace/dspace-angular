import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { AuthConfig } from './auth-config.interfaces';
import { INotificationBoardOptions } from './notifications-config.interfaces';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth: AuthConfig;
  notifications: INotificationBoardOptions;
  universal: UniversalConfig;
  gaTrackingId: string;
  logDirectory: string;
  debug: boolean;
}
