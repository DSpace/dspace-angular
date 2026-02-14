import { AppConfig } from './app.config';
import { BuildConfig } from './build.config';
import { Config } from './config';
import { DefaultAppConfig } from './default-app.config';
import { SSRConfig } from './ssr.config';
import {
  HandleThemeConfig,
  ThemeConfig,
} from './theme.config';

describe('Config Model', () => {

  const mockProductionEnvironment = Config.assign(BuildConfig, {
    production: true,

    // Angular SSR (Server Side Rendering) settings
    ssr: Config.assign(SSRConfig, {
      enabled: true,
      enablePerformanceProfiler: false,
      inlineCriticalCss: false,
      transferState: true,
      replaceRestUrl: true,
      excludePathPatterns: [
        {
          pattern: '^/communities/[a-f0-9-]{36}/browse(/.*)?$',
          flag: 'i',
        },
        {
          pattern: '^/collections/[a-f0-9-]{36}/browse(/.*)?$',
          flag: 'i',
        },
        { pattern: '^/browse/' },
        { pattern: '^/search' },
        { pattern: '^/community-list$' },
        { pattern: '^/statistics/?' },
        { pattern: '^/admin/' },
        { pattern: '^/processes/?' },
        { pattern: '^/notifications/' },
        { pattern: '^/access-control/' },
        { pattern: '^/health$' },
      ],
      enableSearchComponent: false,
      enableBrowseComponent: false,
    }),
  });

  describe('extendEnvironmentWithAppConfig', () => {
    it('should extend prod environment with app config', () => {
      const appConfig: AppConfig = Config.assign(DefaultAppConfig, {});
      expect(appConfig.cache.msToLive.default).toEqual(15 * 60 * 1000); // 15 minute
      expect(appConfig.ui.rateLimiter.windowMs).toEqual(1 * 60 * 1000); // 1 minute
      expect(appConfig.ui.rateLimiter.limit).toEqual(500);
      expect(appConfig.ui.rateLimiter.ipv6Subnet).toEqual(56);
      expect(appConfig.ui.useProxies).toEqual(true);

      expect(appConfig.submission.autosave.metadata).toEqual([]);
      expect(appConfig.submission.duplicateDetection.alwaysShowSection).toEqual(false);

      expect(appConfig.themes.length).toEqual(1);
      expect(appConfig.themes[0].name).toEqual('dspace');

      const msToLive = 1 * 60 * 1000; // 1 minute
      appConfig.cache.msToLive.default = msToLive;

      const rateLimiter = {
        windowMs: 5 * 50 * 1000, // 5 minutes
        limit: 1000,
        ipv6Subnet: 56,
      };
      appConfig.ui.rateLimiter = rateLimiter;

      appConfig.ui.useProxies = false;

      const autoSaveMetadata = [
        'dc.author',
        'dc.title',
      ];

      appConfig.submission.autosave.metadata = autoSaveMetadata;

      const customTheme: HandleThemeConfig = {
        name: 'custom',
        handle: '10673/1233',
      };

      appConfig.themes.push(Config.assign(ThemeConfig, customTheme));

      mockProductionEnvironment.apply(appConfig);

      expect(mockProductionEnvironment.cache.msToLive.default).toEqual(msToLive);
      expect(mockProductionEnvironment.ui.rateLimiter.windowMs).toEqual(rateLimiter.windowMs);
      expect(mockProductionEnvironment.ui.rateLimiter.limit).toEqual(rateLimiter.limit);
      expect(mockProductionEnvironment.ui.rateLimiter.ipv6Subnet).toEqual(rateLimiter.ipv6Subnet);
      expect(mockProductionEnvironment.ui.useProxies).toEqual(false);
      expect(mockProductionEnvironment.submission.autosave.metadata[0]).toEqual(autoSaveMetadata[0]);
      expect(mockProductionEnvironment.submission.autosave.metadata[1]).toEqual(autoSaveMetadata[1]);

      expect(mockProductionEnvironment.themes.length).toEqual(2);
      expect(mockProductionEnvironment.themes[0].name).toEqual('dspace');
      expect(mockProductionEnvironment.themes[1].name).toEqual(customTheme.name);
      expect((mockProductionEnvironment.themes[1] as HandleThemeConfig).handle).toEqual(customTheme.handle);
    });
  });
});
