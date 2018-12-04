import { Config } from './config.interface';

export interface CacheConfig extends Config {
  msToLive: number,
  control: string
}
