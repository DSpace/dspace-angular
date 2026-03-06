import { Config } from './config';

/**
 * Config that determines a metadata sorting config.
 * It's created mainly to sort by metadata community and collection edition and creation
 */
export class QualityAssuranceConfig extends Config {
  /**
   * Url for project search on quality assurance resource
   */
  @Config.publish() sourceUrlMapForProjectSearch: {[key: string]: string};
  /**
   * default count of QA sources to load
   */
  @Config.publish() pageSize: number;
}
