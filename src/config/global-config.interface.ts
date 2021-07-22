import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { FormConfig } from './form-config.interfaces';
import { LangConfig } from './lang-config.interface';
import { BrowseByConfig } from './browse-by-config.interface';
import { ItemPageConfig } from './item-page-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { ThemeConfig } from './theme.model';
import { AuthConfig } from './auth-config.interfaces';
import { UIServerConfig } from './ui-server-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';

export interface GlobalConfig extends Config {
  ui: UIServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth?: AuthConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  universal: UniversalConfig;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  item: ItemPageConfig;
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
}
