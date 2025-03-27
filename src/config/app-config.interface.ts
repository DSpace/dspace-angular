import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { MetricVisualizationConfig } from './metric-visualization-config.interfaces';
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
import { AuthConfig } from './auth-config.interfaces';
import { UIServerConfig } from './ui-server-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { ActuatorsConfig } from './actuators.config';
import { InfoConfig } from './info-config.interface';
import { CommunityListConfig } from './community-list-config.interface';
import { HomeConfig } from './homepage-config.interface';
import { MarkdownConfig } from './markdown-config.interface';
import { FilterVocabularyConfig } from './filter-vocabulary-config';
import { DiscoverySortConfig } from './discovery-sort.config';
import { LiveRegionConfig } from '../app/shared/live-region/live-region.config';
import { SearchConfig } from './search-page-config.interface';
import { CrisLayoutConfig, LayoutConfig, SuggestionConfig } from './layout-config.interfaces';
import { MetadataSecurityConfig } from './metadata-security-config';
import { CmsMetadata } from './cms-metadata';
import { AddToAnyPluginConfig } from './add-to-any-plugin-config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { AdvancedAttachmentRenderingConfig } from './advanced-attachment-rendering.config';
import { AttachmentRenderingConfig } from './attachment-rendering.config';
import { SearchResultConfig } from './search-result-config.interface';
import { MiradorConfig } from './mirador-config.interfaces';
import { LoaderConfig } from './loader-config.interfaces';
import { MetaTagsConfig } from './meta-tags.config';
import { MetadataLinkViewPopoverDataConfig } from './metadata-link-view-popoverdata-config.interface';
import { IdentifierSubtypesConfig } from './identifier-subtypes-config.interface';
import { DatadogRumConfig } from './datadog-rum-config.interfaces';

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
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
  bundle: BundleConfig;
  actuators: ActuatorsConfig
  info: InfoConfig;
  markdown: MarkdownConfig;
  vocabularies: FilterVocabularyConfig[];
  comcolSelectionSort: DiscoverySortConfig;
  liveRegion: LiveRegionConfig;
  search: SearchConfig
  crisLayout: CrisLayoutConfig;
  layout: LayoutConfig;
  security: MetadataSecurityConfig;
  cms: CmsMetadata;
  suggestion: SuggestionConfig[];
  addToAnyPlugin: AddToAnyPluginConfig;
  followAuthorityMetadata: FollowAuthorityMetadata[];
  followAuthorityMaxItemLimit: number;
  followAuthorityMetadataValuesLimit: number;
  metricVisualizationConfig: MetricVisualizationConfig[];
  attachmentRendering: AttachmentRenderingConfig;
  advancedAttachmentRendering: AdvancedAttachmentRenderingConfig;
  searchResult: SearchResultConfig;
  mirador: MiradorConfig;
  loader: LoaderConfig;
  metaTags: MetaTagsConfig;
  metadataLinkViewPopoverData: MetadataLinkViewPopoverDataConfig;
  identifierSubtypes: IdentifierSubtypesConfig[];
  datadogRum?: DatadogRumConfig;
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey<AppConfig>('APP_CONFIG_STATE');

export {
  AppConfig,
  APP_CONFIG,
  APP_CONFIG_STATE
};
