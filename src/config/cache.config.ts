import { AutoSyncConfig } from './auto-sync.config';
import { Config } from './config';
import { RestRequestMethod } from './rest-request-method';

export class CacheConfig extends Config {

  // NOTE: how long should objects be cached for by default
  @Config.public msToLive: {
    default: number;
  } = {
      default: 15 * 60 * 1000, // 15 minutes
    };

  // Cache-Control HTTP Header
  @Config.public control = 'max-age=604800';
  @Config.public autoSync: AutoSyncConfig = {
    defaultTime: 0,
    maxBufferSize: 100,
    timePerMethod: { [RestRequestMethod.PATCH]: 3 }, // time in seconds
  };

  // In-memory caches of server-side rendered (SSR) content. These caches can be used to limit the frequency
  // of re-generating SSR pages to improve performance.
  @Config.deepEnv({
    botCache: {
      max: ['DSPACE_CACHE_SERVERSIDE_BOTCACHE_MAX', Number],
    },
    anonymousCache: {
      max: ['DSPACE_CACHE_SERVERSIDE_ANONYMOUSCACHE_MAX', Number],
    },
  })
  serverSide: {
    // Debug server-side caching.  Set to true to see cache hits/misses/refreshes in console logs.
    debug: boolean,
    // List of response headers to save into the cache
    headers: string[],
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
  } = {
      debug: false,
      // Link header is used for signposting functionality
      headers: ['Link'],
      // Cache specific to known bots.  Allows you to serve cached contents to bots only.
      // Defaults to caching 1,000 pages. Each page expires after 1 day
      botCache: {
        // Maximum number of pages (rendered via SSR) to cache. Setting max=0 disables the cache.
        max: 1000,
        // Amount of time after which cached pages are considered stale (in ms)
        timeToLive: 24 * 60 * 60 * 1000, // 1 day
        allowStale: true,
      },
      // Cache specific to anonymous users. Allows you to serve cached content to non-authenticated users.
      // Defaults to caching 0 pages. But, when enabled, each page expires after 10 seconds (to minimize anonymous users seeing out-of-date content)
      anonymousCache: {
        // Maximum number of pages (rendered via SSR) to cache. Setting max=0 disables the cache.
        max: 0, // disabled by default
        // Amount of time after which cached pages are considered stale (in ms)
        timeToLive: 10 * 1000, // 10 seconds
        allowStale: true,
      },
    };
}
