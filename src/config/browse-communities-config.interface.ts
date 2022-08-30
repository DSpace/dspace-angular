import { Config } from './config.interface';

export interface BrowseCommunitiesConfig extends Config {
  /**
   * Number of entries in the expandable community list (per show more).
   */
   communityListPageSize: number;
  /**
   * Number of entries in the paginated (home page) top level community list.
   */
   topLevelPageSize: number;
}
