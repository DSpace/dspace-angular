import { Config } from './config.interface';

export interface UniversalConfig extends Config {
  async: boolean;
  time: boolean;
}
