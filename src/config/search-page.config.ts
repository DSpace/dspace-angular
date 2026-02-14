import { AdvancedSearchConfig } from './advance-search-config.interface';
import { Config } from './config';

export class SearchConfig extends Config {
  /**
   * List of standard filter to select in adding advanced Search
   * Used by {@link UploadBitstreamComponent}.
   */
  @Config.publish() advancedFilters: AdvancedSearchConfig;
  /**
   * Number used to render n UI elements called loading skeletons that act as placeholders.
   * These elements indicate that some content will be loaded in their stead.
   * Since we don't know how many filters will be loaded before we receive a response from the server we use this parameter for the skeletons count.
   * For instance if we set 5 then 5 loading skeletons will be visualized before the actual filters are retrieved.
   */
  @Config.publish() filterPlaceholdersCount?: number;
}
