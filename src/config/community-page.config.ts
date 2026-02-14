import { Config } from './config';

/**
 * Community Page Config
 */
export class CommunityPageConfig extends Config {
  @Config.publish() defaultBrowseTab: string;
  @Config.publish() searchSection: CommunitySearchSectionConfig;
}

/**
 * Config related to the community's search tab
 */
export interface CommunitySearchSectionConfig {
  showSidebar: boolean;
}
