import { Config } from './config.interface';

/**
 * Config that determines how the recentSubmissions list showing at home page
 */
export interface HomeConfig extends Config {
  recentSubmissions: {
    /**
   * The number of item showing in recent submission components
   */
    pageSize: number;

    /**
     * sort record of recent submission
     */
    sortField: string;

    /**
     * The entity types to show in the recent submission list. If not set, all entity types will be shown
     */
    entityTypes?: string[];
  }

  topLevelCommunityList: {
    pageSize: number;
  };
  /*
  * Enable or disable the Discover filters on the homepage
  */
  showDiscoverFilters: boolean;
}
