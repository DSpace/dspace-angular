import { Config } from './config.interface';

export interface SearchConfig extends Config {
  /**
   * Number used to render n skeletons while the filters are loading
   */
  defaultFilterCount?: number;

}
