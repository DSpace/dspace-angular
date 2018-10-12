import { Config } from './config.interface';
import { AutoSyncConfig } from './auto-sync-config.interface';

export interface CacheConfig extends Config {
  msToLive: {
    default: number;
    exportToZip: number;
  },
  control: string,
  autoSync: AutoSyncConfig
}
