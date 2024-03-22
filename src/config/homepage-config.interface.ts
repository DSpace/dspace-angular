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
  }

  topLevelCommunityList: {
    pageSize: number;
  };
  /*
  * Enable or disable the Discover filters on the homepage
  */
  showDiscoverFilters: boolean;
}
