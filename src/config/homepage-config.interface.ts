import { Config } from './config.interface';

/**
 * Config that determines how the recentSubmissions list showing at home page
 */
export interface HomeConfig extends Config {
  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter: boolean;

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

  /**
   * Disable if you don't want users to edit the homeNews section on your home-page.
   */
  editHomeNews: boolean;

  /**
   * Disable if you don't want users to edit the home header.
   */
  editHomeHeader: boolean;
}
