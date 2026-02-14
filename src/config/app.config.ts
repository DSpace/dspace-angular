import {
  InjectionToken,
  makeStateKey,
} from '@angular/core';
import { hasNoValue } from '@dspace/shared/utils/empty.util';

import { AccessibilitySettingsConfig } from './accessibility-settings.config';
import { ActuatorsConfig } from './actuators.config';
import { AdminNotifyMetricsRowConfig } from './admin-notify-metrics.config';
import { AuthConfig } from './auth.config';
import { BrowseByConfig } from './browse-by.config';
import { BundleConfig } from './bundle.config';
import { CacheConfig } from './cache.config';
import { CollectionPageConfig } from './collection-page.config';
import { CommunityListConfig } from './community-list.config';
import { CommunityPageConfig } from './community-page.config';
import { Config } from './config';
import { DiscoverySortConfig } from './discovery-sort.config';
import { FilterVocabularyConfig } from './filter-vocabulary-config';
import { FormConfig } from './form-config.interfaces';
import { GeospatialMapConfig } from './geospatial-map.config';
import { HomeConfig } from './homepage.config';
import { InfoConfig } from './info.config';
import { ItemConfig } from './item.config';
import { LangConfig } from './lang.config';
import { LiveRegionConfig } from './live-region.config';
import { MarkdownConfig } from './markdown.config';
import { MatomoConfig } from './matomo.config';
import { MediaViewerConfig } from './media-viewer.config';
import { INotificationBoardOptions } from './notifications.config';
import { QualityAssuranceConfig } from './quality-assurance.config';
import { SearchConfig } from './search-page.config';
import { ServerConfig } from './server.config';
import { SubmissionConfig } from './submission.config';
import { SuggestionConfig } from './suggestion.config';
import {
  BASE_THEME_NAME,
  ThemeConfig,
} from './theme.config';
import { UIServerConfig } from './ui-server.config';

export class AppConfig extends Config {
  @Config.publish() ui: UIServerConfig;
  @Config.publish() rest: ServerConfig;
  @Config.publish() production: boolean;
  @Config.publish() cache: CacheConfig;
  @Config.publish() auth?: AuthConfig;
  @Config.publish() form: FormConfig;
  @Config.publish() notifications: INotificationBoardOptions;
  @Config.publish() submission: SubmissionConfig;
  @Config.publish() debug: boolean;
  @Config.publish() fallbackLanguage: string;

  @Config.publish()
  @Config.arrayOf(LangConfig)
  languages: LangConfig[];

  @Config.publish() browseBy: BrowseByConfig;
  @Config.publish() communityList: CommunityListConfig;
  @Config.publish() homePage: HomeConfig;
  @Config.publish() item: ItemConfig;
  @Config.publish() community: CommunityPageConfig;
  @Config.publish() collection: CollectionPageConfig;

  @Config.publish()
  @Config.arrayOf(ThemeConfig)
  themes: ThemeConfig[];
  /**
   * Get default theme config from environment.
   *
   * @returns default theme config
   */
  get defaultTheme() {
    return this.themes.find(theme =>
      hasNoValue(theme.regex) &&
        hasNoValue(theme.handle) &&
        hasNoValue(theme.uuid),
    ) ?? {
      name: BASE_THEME_NAME,
    };
  };

  @Config.publish() mediaViewer: MediaViewerConfig;

  @Config.publish()
  @Config.arrayOf(SuggestionConfig)
  suggestion: SuggestionConfig[];

  @Config.publish() bundle: BundleConfig;
  @Config.publish() actuators: ActuatorsConfig;
  @Config.publish() info: InfoConfig;
  @Config.publish() markdown: MarkdownConfig;

  @Config.publish()
  @Config.arrayOf(FilterVocabularyConfig)
  vocabularies: FilterVocabularyConfig[];

  @Config.publish() comcolSelectionSort: DiscoverySortConfig;
  @Config.publish() qualityAssuranceConfig: QualityAssuranceConfig;
  @Config.publish() search: SearchConfig;

  @Config.publish()
  @Config.arrayOf(AdminNotifyMetricsRowConfig)
  notifyMetrics: AdminNotifyMetricsRowConfig[];

  @Config.publish() liveRegion: LiveRegionConfig;
  @Config.publish() matomo?: MatomoConfig;
  @Config.publish() geospatialMapViewer: GeospatialMapConfig;
  @Config.publish() accessibility: AccessibilitySettingsConfig;
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const APP_CONFIG_STATE = makeStateKey<AppConfig>('APP_CONFIG_STATE');
