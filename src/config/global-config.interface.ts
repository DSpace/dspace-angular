import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { FormConfig } from './form-config.interfaces';
import {LangConfig} from './lang-config.interface';
import { BrowseByConfig } from './browse-by-config.interface';
import { ItemPageConfig } from './item-page-config.interface';
import { Theme } from './theme.inferface';

export interface GlobalConfig extends Config {
  ui: ServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  universal: UniversalConfig;
  gaTrackingId: string;
  logDirectory: string;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  item: ItemPageConfig;
  themes: Theme[];
}
