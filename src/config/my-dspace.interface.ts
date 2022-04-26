import { Config } from './config.interface';

/**
 * Config that determines some aspects of the MyDSpace section
 */
export interface MyDSpaceConfig extends Config {
  /**
   * The list of additional metadatas to display at then end of the item component
   */
  additionalMetadatas: AdditionalMetaConfig[]
}

/**
 * Config that represents an additional metadata.
 * Contains a value matching a metadata code.
 */
export interface AdditionalMetaConfig extends Config {
  value: string;
}
