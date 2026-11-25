import { BuildConfig } from '@dspace/config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular SSR (Server Side Rendering) settings
  ssr: {
    // WARNING: Disabling SSR will block major search engine crawlers (like Google Scholar) from indexing your site.
    // Therefore, we highly recommend keeping SSR enabled at all times. However, for better performance, you may choose
    // to minimize the paths that undergo SSR via the "excludePathPatterns" setting below.
    enabled: true,
    enablePerformanceProfiler: false,
    inlineCriticalCss: false,
    transferState: true,
    replaceRestUrl: true,
    // WARNING: changing these settings may impact your Search Engine Optimization (SEO). Any paths listed in "excludedPathPatterns"
    // may NOT be indexable by search engine crawlers (like Google Scholar). For search engine crawlers to fully index your site,
    // this "excludePathPatterns" should NEVER exclude SSR from the homepage, community/collection pages or item/entity pages.
    // "excludePathStrategy" defines where the patterns are enforced:
    // - 'router': the Angular router blocks the matched route during SSR, unknown paths still return a proper 404.
    // - 'server': server.ts serves the CSR index.html without bootstrapping Angular (cheaper, but always returns a 200).
    excludePathStrategy: 'router',
    excludePathPatterns: [
      { pattern: '^/(communities|collections)/[a-fA-F0-9-]{36}/(browse|search)' },
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
  },
};
