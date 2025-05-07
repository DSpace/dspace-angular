import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false,
    inlineCriticalCss: false,
    transferState: true,
    replaceRestUrl: true,
    excludePathPatterns: [
      /^\/communities\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/browse(\/.*)?$/i,
      /^\/collections\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/browse(\/.*)?$/i,
      /^\/browse\//,
      /^\/search$/,
      /^\/community-list$/,
      /^\/statistics\//,
      /^\/admin$/,
      /^\/processes$/,
      /^\/notifications$/,
      /^\/health$/,
    ],
    enableSearchComponent: false,
    enableBrowseComponent: false,
  },
};
