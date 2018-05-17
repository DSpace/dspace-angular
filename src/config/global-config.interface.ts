import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { AuthConfig } from './auth-config.interfaces';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { FiltersConfig } from './filters-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth: AuthConfig;
  filters: FiltersConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  universal: UniversalConfig;
  gaTrackingId: string;
  logDirectory: string;
  debug: boolean;
}
