import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { SubmissionConfig } from './submission-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  submission: SubmissionConfig;
  notifications: INotificationBoardOptions;
  universal: UniversalConfig;
  logDirectory: string;
  debug: boolean;
}
