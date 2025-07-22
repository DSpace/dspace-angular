import {
  InjectionToken,
  makeStateKey,
  Type,
} from '@angular/core';

import { AccessibilitySettingsConfig } from '../app/accessibility/accessibility-settings.config';
import { AdminNotifyMetricsRow } from '../app/admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';
import { HALDataService } from '../app/core/data/base/hal-data-service.interface';
import { FieldRenderingType } from '../app/cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/field-rendering-type';
import { MetadataBoxFieldRenderOptions } from '../app/cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/rendering-type.model';
import { LiveRegionConfig } from '../app/shared/live-region/live-region.config';
import { ActuatorsConfig } from './actuators.config';
import { AddToAnyPluginConfig } from './add-to-any-plugin-config';
import { AdvancedAttachmentRenderingConfig } from './advanced-attachment-rendering.config';
import { AttachmentRenderingConfig } from './attachment-rendering.config';
import { AuthConfig } from './auth-config.interfaces';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { CacheConfig } from './cache-config.interface';
import { CmsMetadata } from './cms-metadata';
import { CollectionPageConfig } from './collection-page-config.interface';
import { CommunityListConfig } from './community-list-config.interface';
import { CommunityPageConfig } from './community-page-config.interface';
import { Config } from './config.interface';
import { DatadogRumConfig } from './datadog-rum-config.interfaces';
import { DiscoverySortConfig } from './discovery-sort.config';
import { FilterVocabularyConfig } from './filter-vocabulary-config';
import { FormConfig } from './form-config.interfaces';
import { HomeConfig } from './homepage-config.interface';
import { IdentifierSubtypesConfig } from './identifier-subtypes-config.interface';
import { InfoConfig } from './info-config.interface';
import { ItemConfig } from './item-config.interface';
import { LangConfig } from './lang-config.interface';
import {
  CrisLayoutConfig,
  LayoutConfig,
} from './layout-config.interfaces';
import { LoaderConfig } from './loader-config.interfaces';
import { MarkdownConfig } from './markdown-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { MetaTagsConfig } from './meta-tags.config';
import { MetadataLinkViewPopoverDataConfig } from './metadata-link-view-popoverdata-config.interface';
import { MetadataSecurityConfig } from './metadata-security-config';
import { MetricVisualizationConfig } from './metric-visualization-config.interfaces';
import { MiradorConfig } from './mirador-config.interfaces';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { QualityAssuranceConfig } from './quality-assurance.config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { SearchConfig } from './search-page-config.interface';
import { SearchResultConfig } from './search-result-config.interface';
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
  liveRegion: LiveRegionConfig;
  accessibility: AccessibilitySettingsConfig;
  crisLayout: CrisLayoutConfig;
  layout: LayoutConfig;
  security: MetadataSecurityConfig;
  cms: CmsMetadata;
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

export type LazyDataServicesMap = Map<string, () => Promise<Type<HALDataService<any>> | { default: HALDataService<any> }>>;

export const APP_DATA_SERVICES_MAP: InjectionToken<LazyDataServicesMap> = new InjectionToken<LazyDataServicesMap>('APP_DATA_SERVICES_MAP');


export const CRIS_FIELD_RENDERING_MAP: InjectionToken<Map<FieldRenderingType, MetadataBoxFieldRenderOptions>> = new InjectionToken<Map<FieldRenderingType, MetadataBoxFieldRenderOptions>>('CRIS_FIELD_RENDERING_MAP');

export {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
};
