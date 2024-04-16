import {
  InjectionToken,
  makeStateKey,
  Type,
} from '@angular/core';

import { AdminNotifyMetricsRow } from '../app/admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';
import { HALDataService } from '../app/core/data/base/hal-data-service.interface';
import { ActuatorsConfig } from './actuators.config';
import { AuthConfig } from './auth-config.interfaces';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { CacheConfig } from './cache-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { CommunityListConfig } from './community-list-config.interface';
import { CommunityPageConfig } from './community-page-config.interface';
import { Config } from './config.interface';
import { DiscoverySortConfig } from './discovery-sort.config';
import { FilterVocabularyConfig } from './filter-vocabulary-config';
import { FormConfig } from './form-config.interfaces';
import { HomeConfig } from './homepage-config.interface';
import { InfoConfig } from './info-config.interface';
import { ItemConfig } from './item-config.interface';
import { LangConfig } from './lang-config.interface';
import { MarkdownConfig } from './markdown-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { QualityAssuranceConfig } from './quality-assurance.config';
import { SearchConfig } from './search-page-config.interface';
import { ServerConfig } from './server-config.interface';
import { SubmissionConfig } from './submission-config.interface';
import { SuggestionConfig } from './suggestion-config.interfaces';
import { ThemeConfig } from './theme.config';
import { UIServerConfig } from './ui-server-config.interface';

interface AppConfig extends Config {
  ui: UIServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth?: AuthConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  communityList: CommunityListConfig;
  homePage: HomeConfig;
  item: ItemConfig;
  community: CommunityPageConfig;
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
  suggestion: SuggestionConfig[];
  bundle: BundleConfig;
  actuators: ActuatorsConfig
  info: InfoConfig;
  markdown: MarkdownConfig;
  vocabularies: FilterVocabularyConfig[];
  comcolSelectionSort: DiscoverySortConfig;
  qualityAssuranceConfig: QualityAssuranceConfig;
  search: SearchConfig;
  notifyMetrics: AdminNotifyMetricsRow[];
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey<AppConfig>('APP_CONFIG_STATE');

export type LazyDataServicesMap = Map<string, () => Promise<Type<HALDataService<any>> | { default: HALDataService<any> }>>;

export const APP_DATA_SERVICES_MAP: InjectionToken<LazyDataServicesMap> = new InjectionToken<LazyDataServicesMap>('APP_DATA_SERVICES_MAP');

export {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
};
