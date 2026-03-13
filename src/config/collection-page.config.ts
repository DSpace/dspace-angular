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
  @Config.public defaultBrowseTab = 'search';
  @Config.public searchSection: CollectionSearchSectionConfig = {
    showSidebar: true,
  };
  @Config.public edit: {
    undoTimeout: number;
  } = {
      undoTimeout: 10000, // 10 seconds
    };
}
