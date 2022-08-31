import { Config } from './config.interface';

/**
 * Config that determines how the dropdown list of years are created for browse-by-date components
 */
export interface HomeConfig extends Config {
  /**
   * The number of item showing in recent submission components
   */
   recentSubmissionsRpp: number;

  /**
   * sort record of recent submission
   */
   recentSubmissionsSortField: string;

}
