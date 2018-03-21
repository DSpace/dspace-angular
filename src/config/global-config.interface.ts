import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { AuthConfig } from './auth-config.interfaces';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth: AuthConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  universal: UniversalConfig;
  logDirectory: string;
  debug: boolean;
}
