import { Config } from './config';

/**
 * Community Page Config
 */
export class CommunityPageConfig extends Config {
  @Config.public defaultBrowseTab = 'search';
  @Config.public searchSection: CommunitySearchSectionConfig = {
    showSidebar: true,
  };
}

/**
 * Config related to the community's search tab
 */
export interface CommunitySearchSectionConfig {
  showSidebar: boolean;
}
