import { Config } from './config.interface';

/**
 * Collection Page Config
 */
export interface CollectionPageConfig extends Config {
  searchSection: CollectionSearchSectionConfig;
  edit: {
    undoTimeout: number;
  };
}

/**
 * Config related to the collection's search tab
 */
export interface CollectionSearchSectionConfig {
  showSidebar: boolean;
}
