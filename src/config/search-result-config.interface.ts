import { Config } from './config.interface';
import { AdditionalMetadataConfig } from './additional-metadata.config';

export interface SearchResultConfig extends Config {
  additionalMetadataFields: SearchResultAdditionalMetadataEntityTypeConfig[],
}

export interface SearchResultAdditionalMetadataEntityTypeConfig extends Config {
  entityType: string,
  metadataConfiguration: Array<AdditionalMetadataConfig>[]
}
