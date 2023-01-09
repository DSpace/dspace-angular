import { Config } from './config.interface';
import { AutoSyncConfig } from './auto-sync-config.interface';

export interface CacheConfig extends Config {
  msToLive: {
    default: number;
  };
  // Cache-Control HTTP Header
  control: string;
  autoSync: AutoSyncConfig;
  // In-memory cache of server-side rendered content
  serverSide: {
    // Maximum number of pages (rendered via SSR) to cache.
    max: number;
    // Amount of time after which cached pages are considered stale (in ms)
    timeToLive: number;
  }
}
