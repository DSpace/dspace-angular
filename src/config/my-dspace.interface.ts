import { Config } from './config.interface';

/**
 * Config that determines some aspects of the MyDSpace section
 */
export interface MyDSpaceConfig extends Config {
  /**
   * The list of additional metadata fields to display at the end of the item component
   */
   additionalMetadataFields:  string[]
}

