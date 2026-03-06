import { Config } from './config';

/**
 * Config related to the collection's search tab
 */
export interface CollectionSearchSectionConfig {
  showSidebar: boolean;
}

/**
 * Collection Page Config
 */
export class CollectionPageConfig extends Config {
  @Config.publish() defaultBrowseTab: string;
  @Config.publish() searchSection: CollectionSearchSectionConfig;
  @Config.publish() edit: {
    undoTimeout: number;
  };
}
