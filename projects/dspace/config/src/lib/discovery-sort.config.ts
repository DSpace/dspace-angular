import { Config } from './config.interface';

/**
 * Config that determines a metadata sorting config.
 * It's created mainly to sort by metadata community and collection edition and creation
 */
export class DiscoverySortConfig implements Config {

  public sortField: string;
  /**
   * ASC / DESC values expected
   */
  public sortDirection: string;
}
