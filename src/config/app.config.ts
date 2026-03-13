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
import { SSRConfig } from './ssr.config';
import { SubmissionConfig } from './submission.config';
import { SuggestionConfig } from './suggestion.config';
import {
  BASE_THEME_NAME,
  ThemeConfig,
} from './theme.config';
import { UIServerConfig } from './ui-server.config';

export class AppConfig extends Config {
  @Config.public ui = new UIServerConfig();
  @Config.public rest = new ServerConfig();
  @Config.public production = false;
  @Config.public ssr = new SSRConfig();
  @Config.public cache = new CacheConfig();
  @Config.public auth = new AuthConfig();
  @Config.public form = new FormConfig();
  @Config.public notifications = new INotificationBoardOptions();
  @Config.public submission = new SubmissionConfig();
  @Config.public debug = false;
  @Config.public fallbackLanguage = 'en';

  @Config.public
  @Config.arrayOf(LangConfig)
  languages = Config.assignArray(LangConfig, [
    { code: 'en', label: 'English', active: true },
    { code: 'ar', label: 'العربية', active: true },
    { code: 'bn', label: 'বাংলা', active: true },
    { code: 'ca', label: 'Català', active: true },
    { code: 'cs', label: 'Čeština', active: true },
    { code: 'de', label: 'Deutsch', active: true },
    { code: 'el', label: 'Ελληνικά', active: true },
    { code: 'es', label: 'Español', active: true },
    { code: 'fa', label: 'فارسی', active: true },
    { code: 'fi', label: 'Suomi', active: true },
    { code: 'fr', label: 'Français', active: true },
    { code: 'gd', label: 'Gàidhlig', active: true },
    { code: 'gu', label: 'ગુજરાતી', active: true },
    { code: 'hi', label: 'हिंदी', active: true },
    { code: 'hu', label: 'Magyar', active: true },
    { code: 'it', label: 'Italiano', active: true },
    { code: 'kk', label: 'Қазақ', active: true },
    { code: 'lv', label: 'Latviešu', active: true },
    { code: 'ml', label: 'മലയാളം', active: true },
    { code: 'mr', label: 'मराठी', active: true },
    { code: 'nl', label: 'Nederlands', active: true },
    { code: 'od', label: 'ଓଡିଆ', active: true },
    { code: 'pl', label: 'Polski', active: true },
    { code: 'pt-PT', label: 'Português', active: true },
    { code: 'pt-BR', label: 'Português do Brasil', active: true },
    { code: 'ru', label: 'Русский', active: true },
    { code: 'sr-lat', label: 'Srpski (lat)', active: true },
    { code: 'sr-cyr', label: 'Српски', active: true },
    { code: 'sv', label: 'Svenska', active: true },
    { code: 'te', label: 'తెలుగు', active: true },
    { code: 'ta', label: 'தமிழ்', active: true },
    { code: 'tr', label: 'Türkçe', active: true },
    { code: 'uk', label: 'Yкраї́нська', active: true },
    { code: 'vi', label: 'Tiếng Việt', active: true },
    { code: 'zh-TW', label: '繁体中文', active: true },
  ]);

  @Config.public browseBy = new BrowseByConfig();
  @Config.public communityList = new CommunityListConfig();
  @Config.public homePage = new HomeConfig();
  @Config.public item = new ItemConfig();
  @Config.public community = new CommunityPageConfig();
  @Config.public collection = new CollectionPageConfig();

  @Config.public
  @Config.arrayOf(ThemeConfig)
  themes = Config.assignArray(ThemeConfig, [
    // Add additional themes here. In the case where multiple themes match a route, the first one
    // in this list will get priority. It is advisable to always have a theme that matches
    // every route as the last one

    // {
    //   // A theme with a handle property will match the community, collection or item with the given
    //   // handle, and all collections and/or items within it
    //   name: 'custom',
    //   handle: '10673/1233'
    // },
    // {
    //   // A theme with a regex property will match the route using a regular expression. If it
    //   // matches the route for a community or collection it will also apply to all collections
    //   // and/or items within it
    //   name: 'custom',
    //   regex: 'collections\/e8043bc2.*'
    // },
    // {
    //   // A theme with a uuid property will match the community, collection or item with the given
    //   // ID, and all collections and/or items within it
    //   name: 'custom',
    //   uuid: '0958c910-2037-42a9-81c7-dca80e3892b4'
    // },
    // {
    //   // The extends property specifies an ancestor theme (by name). Whenever a themed component is not found
    //   // in the current theme, its ancestor theme(s) will be checked recursively before falling back to default.
    //   name: 'custom-A',
    //   extends: 'custom-B',
    //   // Any of the matching properties above can be used
    //   handle: '10673/34'
    // },
    // {
    //   name: 'custom-B',
    //   extends: 'custom',
    //   handle: '10673/12'
    // },
    // {
    //   // A theme with only a name will match every route
    //   name: 'custom'
    // },
    // {
    //   // This theme will use the default bootstrap styling for DSpace components
    //   name: BASE_THEME_NAME
    // },

    {
      // The default dspace theme
      name: 'dspace',
      // Whenever this theme is active, the following tags will be injected into the <head> of the page.
      // Example use case: set the favicon based on the active theme.
      headTags: [
        {
          // Insert <link rel="icon" href="assets/dspace/images/favicons/favicon.ico" sizes="any"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'icon',
            'href': 'assets/dspace/images/favicons/favicon.ico',
            'sizes': 'any',
          },
        },
        {
          // Insert <link rel="icon" href="assets/dspace/images/favicons/favicon.svg" type="image/svg+xml"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'icon',
            'href': 'assets/dspace/images/favicons/favicon.svg',
            'type': 'image/svg+xml',
          },
        },
        {
          // Insert <link rel="apple-touch-icon" href="assets/dspace/images/favicons/apple-touch-icon.png"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'apple-touch-icon',
            'href': 'assets/dspace/images/favicons/apple-touch-icon.png',
          },
        },
        {
          // Insert <link rel="manifest" href="assets/dspace/images/favicons/manifest.webmanifest"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'manifest',
            'href': 'assets/dspace/images/favicons/manifest.webmanifest',
          },
        },
      ],
    },
  ]);

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

  @Config.public mediaViewer = new MediaViewerConfig();

  @Config.public
  @Config.arrayOf(SuggestionConfig)
  suggestion = Config.assignArray(SuggestionConfig, [
    // {
    //   // Use this configuration to map a suggestion import to a specific collection based on the suggestion type.
    //   source: 'suggestionSource',
    //   collectionId: 'collectionUUID'
    // }
    // This is used as a default fallback in case there aren't collections where to import the suggestion
    // If not mapped the user will be allowed to import the suggestions only in the provided options, shown clicking the button "Approve and import"
    // If not mapped and no options available for import the user won't be able to import the suggestions.
  ]);


  @Config.public bundle = new BundleConfig();
  @Config.public actuators = new ActuatorsConfig();
  @Config.public info = new InfoConfig();
  @Config.public markdown = new MarkdownConfig();

  @Config.public
  @Config.arrayOf(FilterVocabularyConfig)
  vocabularies = Config.assignArray(FilterVocabularyConfig, [
    {
      filter: 'subject',
      vocabulary: 'srsc',
      enabled: false,
    },
  ]);

  @Config.public comcolSelectionSort = new DiscoverySortConfig();
  @Config.public qualityAssuranceConfig = new QualityAssuranceConfig();
  @Config.public search = new SearchConfig();

  @Config.public
  @Config.arrayOf(AdminNotifyMetricsRowConfig)
  notifyMetrics = Config.assignArray(AdminNotifyMetricsRowConfig, [
    {
      title: 'admin-notify-dashboard.received-ldn',
      boxes: [
        {
          color: '#B8DAFF',
          title: 'admin-notify-dashboard.NOTIFY.incoming.accepted',
          config: 'NOTIFY.incoming.accepted',
          description: 'admin-notify-dashboard.NOTIFY.incoming.accepted.description',
        },
        {
          color: '#D4EDDA',
          title: 'admin-notify-dashboard.NOTIFY.incoming.processed',
          config: 'NOTIFY.incoming.processed',
          description: 'admin-notify-dashboard.NOTIFY.incoming.processed.description',
        },
        {
          color: '#FDBBC7',
          title: 'admin-notify-dashboard.NOTIFY.incoming.failure',
          config: 'NOTIFY.incoming.failure',
          description: 'admin-notify-dashboard.NOTIFY.incoming.failure.description',
        },
        {
          color: '#FDBBC7',
          title: 'admin-notify-dashboard.NOTIFY.incoming.untrusted',
          config: 'NOTIFY.incoming.untrusted',
          description: 'admin-notify-dashboard.NOTIFY.incoming.untrusted.description',
        },
        {
          color: '#43515F',
          title: 'admin-notify-dashboard.NOTIFY.incoming.involvedItems',
          textColor: '#fff',
          config: 'NOTIFY.incoming.involvedItems',
          description: 'admin-notify-dashboard.NOTIFY.incoming.involvedItems.description',
        },
      ],
    },
    {
      title: 'admin-notify-dashboard.generated-ldn',
      boxes: [
        {
          color: '#D4EDDA',
          title: 'admin-notify-dashboard.NOTIFY.outgoing.delivered',
          config: 'NOTIFY.outgoing.delivered',
          description: 'admin-notify-dashboard.NOTIFY.outgoing.delivered.description',
        },
        {
          color: '#B8DAFF',
          title: 'admin-notify-dashboard.NOTIFY.outgoing.queued',
          config: 'NOTIFY.outgoing.queued',
          description: 'admin-notify-dashboard.NOTIFY.outgoing.queued.description',
        },
        {
          color: '#FDEEBB',
          title: 'admin-notify-dashboard.NOTIFY.outgoing.queued_for_retry',
          config: 'NOTIFY.outgoing.queued_for_retry',
          description: 'admin-notify-dashboard.NOTIFY.outgoing.queued_for_retry.description',
        },
        {
          color: '#FDBBC7',
          title: 'admin-notify-dashboard.NOTIFY.outgoing.failure',
          config: 'NOTIFY.outgoing.failure',
          description: 'admin-notify-dashboard.NOTIFY.outgoing.failure.description',
        },
        {
          color: '#43515F',
          title: 'admin-notify-dashboard.NOTIFY.outgoing.involvedItems',
          textColor: '#fff',
          config: 'NOTIFY.outgoing.involvedItems',
          description: 'admin-notify-dashboard.NOTIFY.outgoing.involvedItems.description',
        },
      ],
    },
  ]);


  @Config.public liveRegion = new LiveRegionConfig();
  @Config.public matomo = new MatomoConfig();
  @Config.public geospatialMapViewer = new GeospatialMapConfig();
  @Config.public accessibility = new AccessibilitySettingsConfig();
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const APP_CONFIG_STATE = makeStateKey<AppConfig>('APP_CONFIG_STATE');
