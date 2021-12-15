import { Config } from './config.interface';

/**
 * Config that determines how to follow metadata of search results.
 */
export interface FollowAuthorityMetadata extends Config {

  /**
   * The type of the browse by dspace object result.
   */
  type: string;

  /**
   * The metadata to follow of the browse by dspace object result.
   */
  metadata: string[];

}
