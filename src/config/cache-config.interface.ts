import { Config } from './config.interface';
import { AutoSyncConfig } from './auto-sync-config.interface';

export interface CacheConfig extends Config {
  msToLive: number,
  control: string,
  // autoSync: AutoSyncConfig
}
