import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { FormConfig } from './form-config.interfaces';
import { LangConfig } from './lang-config.interface';
import { ItemConfig } from './item-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { ThemeConfig } from './theme.config';
import { ActuatorsConfig } from './actuators.config';
import { AuthConfig } from './auth-config.interfaces';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { CommunityListConfig } from './community-list-config.interface';
import { CommunityPageConfig } from './community-page-config.interface';
import { DiscoverySortConfig } from './discovery-sort.config';
import { FilterVocabularyConfig } from './filter-vocabulary-config';
import { HomeConfig } from './homepage-config.interface';
import { InfoConfig } from './info-config.interface';
import { MarkdownConfig } from './markdown-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { QualityAssuranceConfig } from './quality-assurance.config';
import { CrisLayoutConfig, LayoutConfig } from './layout-config.interfaces';
import { SuggestionConfig } from './suggestion-config.interfaces';
import { UIServerConfig } from './ui-server-config.interface';
import { SearchConfig } from './search-page-config.interface';
import {
  AdminNotifyMetricsRow
} from '../app/admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';
import { MetadataSecurityConfig } from './metadata-security-config';
import { CmsMetadata } from './cms-metadata';
import { AddToAnyPluginConfig } from './add-to-any-plugin-config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { MetricVisualizationConfig } from './metric-visualization-config.interfaces';
import { AttachmentRenderingConfig } from './attachment-rendering.config';
import { AdvancedAttachmentRenderingConfig } from './advanced-attachment-rendering.config';
import { SearchResultConfig } from './search-result-config.interface';
import { MiradorConfig } from './mirador-config.interfaces';

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
  crisLayout: CrisLayoutConfig;
  layout: LayoutConfig;
  security: MetadataSecurityConfig;
  cms: CmsMetadata;
  addToAnyPlugin: AddToAnyPluginConfig;
  followAuthorityMetadata: FollowAuthorityMetadata[];
  metricVisualizationConfig: MetricVisualizationConfig[];
  attachmentRendering: AttachmentRenderingConfig;
  advancedAttachmentRendering: AdvancedAttachmentRenderingConfig;
  searchResult: SearchResultConfig;
  mirador: MiradorConfig;
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey<AppConfig>('APP_CONFIG_STATE');

export {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
};
