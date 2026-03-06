import { Config } from './config';

/**
 * Config that determines how the recentSubmissions list showing at home page
 */
export class HomeConfig extends Config {
  @Config.publish() recentSubmissions: {
    /**
   * The number of item showing in recent submission components
   */
    pageSize: number;

    /**
     * sort record of recent submission
     */
    sortField: string;
  };

  @Config.publish() topLevelCommunityList: {
    pageSize: number;
  };
  /*
  * Enable or disable the Discover filters on the homepage
  */
  @Config.publish() showDiscoverFilters: boolean;
}
