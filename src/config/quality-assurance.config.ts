import { Config } from './config.interface';

/**
 * Config that determines a metadata sorting config.
 * It's created mainly to sort by metadata community and collection edition and creation
 */
export class QualityAssuranceConfig implements Config {

  /**
   * Url for project search on quality assurance resource
   */
  public sourceUrlMapForProjectSearch: {[key: string]: string};
  /**
   * default count of QA sources to load
   */
  public pageSize: number;
}
