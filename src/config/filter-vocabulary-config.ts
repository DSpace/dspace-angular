import { Config } from './config';

/**
 * Configuration that can be used to enable a vocabulary tree to be used as search filter
 */
export class FilterVocabularyConfig extends Config {
  /**
   * The name of the filter where the vocabulary tree should be used
   * This is the name of the filter as it's configured in the facet in discovery.xml
   * (can also be seen on the /server/api/discover/facets endpoint)
   */
  @Config.public filter: string;
  /**
   * name of the vocabulary tree to use
   * ( name of the file as stored in the dspace/config/controlled-vocabularies folder without file extension )
   */
  @Config.public vocabulary: string;
  /**
   * Whether to show the vocabulary tree in the sidebar
   */
  @Config.public enabled: boolean;
}
