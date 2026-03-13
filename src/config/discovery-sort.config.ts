import { Config } from './config';

/**
 * Config that determines a metadata sorting config.
 * It's created mainly to sort by metadata community and collection edition and creation
 */
export class DiscoverySortConfig extends Config {
  @Config.public sortField = 'dc.title';
  /**
   * ASC / DESC values expected
   */
  @Config.public sortDirection = 'ASC';
}
