import { autoserialize, autoserializeAs, deserializeAs, deserialize } from 'cerialize';
import { HALLink } from './hal-link.model';
import { HALResource } from './hal-resource.model';
import { MetadataConfig } from './metadata-config.model';

/**
 * The type of content harvesting used
 */
export enum ContentSourceHarvestType {
  None = 'NONE',
  Metadata = 'METADATA_ONLY',
  MetadataAndRef = 'METADATA_AND_REF',
  MetadataAndBitstreams = 'METADATA_AND_BITSTREAMS'
}

/**
 * A model class that holds information about the Content Source of a Collection
 */
export class ContentSource implements HALResource {
  /**
   * Unique identifier, this is necessary to store the ContentSource in FieldUpdates
   * Because the ContentSource coming from the REST API doesn't have a UUID, we're using the selflink
   */
  @deserializeAs('self')
  uuid: string;

  /**
   * OAI Provider / Source
   */
  @autoserializeAs('oai_source')
  oaiSource: string;

  /**
   * OAI Specific set ID
   */
  @autoserializeAs('oai_set_id')
  oaiSetId: string;

  /**
   * The ID of the metadata format used
   */
  @autoserializeAs('metadata_config_id')
  metadataConfigId: string;

  /**
   * Type of content being harvested
   * Defaults to 'NONE', meaning the collection doesn't harvest its content from an external source
   */
  @autoserializeAs('harvest_type')
  harvestType = ContentSourceHarvestType.None;

  /**
   * The available metadata configurations
   */
  metadataConfigs: MetadataConfig[];

  /**
   * The {@link HALLink}s for this ContentSource
   */
  @deserialize
  _links: {
    self: HALLink
  }
}
