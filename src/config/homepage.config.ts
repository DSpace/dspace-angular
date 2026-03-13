import { Config } from './config';

/**
 * Config that determines how the recentSubmissions list showing at home page
 */
export class HomeConfig extends Config {
  @Config.public recentSubmissions: {
    /**
     * The number of item showing in recent submission components
     */
    pageSize: number;

    /**
     * sort record of recent submission
     */
    sortField: string;
  } = {
      //The number of item showing in recent submission components
      pageSize: 5,
      //sort record of recent submission
      sortField: 'dc.date.accessioned',
    };

  @Config.public topLevelCommunityList: {
    pageSize: number;
  } = {
      pageSize: 5,
    };

  /*
  * Enable or disable the Discover filters on the homepage
  */
  @Config.public showDiscoverFilters = false;
}
