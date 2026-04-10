import { Config } from './config.interface';

/**
 * Community Page Config
 */
export interface CommunityPageConfig extends Config {
  defaultBrowseTab: string;
  searchSection: CommunitySearchSectionConfig;
}

/**
 * Config related to the community's search tab
 */
export interface CommunitySearchSectionConfig {
  showSidebar: boolean;
}
