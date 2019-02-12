import { Config } from './config.interface';

export interface BrowseByConfig extends Config {
  oneYearLimit: number;
  fiveYearLimit: number;
  defaultLowerLimit: number;
}
