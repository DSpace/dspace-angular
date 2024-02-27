import { Config } from './config.interface';
import { AdvancedSearchConfig } from './advance-search-config.interface';
export interface SearchConfig extends Config {

    /**
     * List of standard filter to select in adding advanced Search
     * Used by {@link UploadBitstreamComponent}.
     */
    advancedFilters: AdvancedSearchConfig;

}
