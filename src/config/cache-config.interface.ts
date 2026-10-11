import { AutoSyncConfig } from './auto-sync-config.interface';
import { Config } from './config.interface';

/** Cache only explicitly matched routes; the most specific pattern wins. */
export interface RedisCacheRouteConfig {
  // Full router-relative path; '*' matches any characters, including '/'.
  pattern: string;
  // Milliseconds. Zero bypasses both cache reads and writes.
  timeToLive: number;
  // Milliseconds. Omitted or zero disables background refresh.
  refreshWhenTimeBelow?: number;
}

export interface RedisCacheConfig {
  enabled: boolean;
  url: string;
  keyPrefix: string;
  connectTimeout: number;
  commandTimeout: number;
  refreshLockTimeToLive: number;
  routes?: RedisCacheRouteConfig[];
}

export interface CacheConfig extends Config {
  msToLive: {
    default: number;
  };
  // Cache-Control HTTP Header
  control: string;
  // These static files should not be cached (paths relative to dist/browser, including the leading slash)
  noCacheFiles: string[]
  autoSync: AutoSyncConfig;
  // Caches of server-side rendered (SSR) content. These caches can be used to limit the frequency
  // of re-generating SSR pages to improve performance.
  serverSide: {
    // Debug server-side caching.  Set to true to see cache hits/misses/refreshes in console logs.
    debug: boolean,
    // List of response headers to save into the cache
    headers: string[],
    // Optional shared Redis cache replacing both in-memory caches for anonymous SSR requests.
    redis?: RedisCacheConfig,
    // Cache specific to known bots.  Allows you to serve cached contents to bots only.
    botCache: {
      // Maximum number of pages (rendered via SSR) to cache. Setting max=0 disables the cache.
      max: number;
      // Amount of time after which cached pages are considered stale (in ms)
      timeToLive: number;
      // true = return page from cache after timeToLive expires. false = return a fresh page after timeToLive expires
      allowStale: boolean;
    },
    // Cache specific to anonymous users. Allows you to serve cached content to non-authenticated users.
    anonymousCache: {
      // Maximum number of pages (rendered via SSR) to cache. Setting max=0 disables the cache.
      max: number;
      // Amount of time after which cached pages are considered stale (in ms)
      timeToLive: number;
      // true = return page from cache after timeToLive expires. false = return a fresh page after timeToLive expires
      allowStale: boolean;
    }
  }
}
