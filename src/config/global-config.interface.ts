import { CacheConfig } from './cache-config.interface';
import { Config } from './config.interface';
import { FormConfig } from './form-config.interfaces';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { ServerConfig } from './server-config.interface';
import { UniversalConfig } from './universal-config.interface';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  universal: UniversalConfig;
  gaTrackingId: string;
  logDirectory: string;
  debug: boolean;
}
