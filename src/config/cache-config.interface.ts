import { Config } from './config.interface';

export interface CacheConfig extends Config {
  msToLive: {
    default: number;
    exportToZip: number;
  },
  control: string
}
