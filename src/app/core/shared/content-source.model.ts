import { autoserializeAs, deserializeAs, deserialize } from 'cerialize';
import { HALLink } from './hal-link.model';
import { MetadataConfig } from './metadata-config.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { typedObject } from '../cache/builders/build-decorators';
import { CONTENT_SOURCE } from './content-source.resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';

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
@typedObject
export class ContentSource extends CacheableObject {
  static type = CONTENT_SOURCE;

  /**
   * The object type
   *
   * The rest api doesn't provide one, so it's hardcoded here,
   * and we need a custom responseparser for ContentSource responses
   */
  @excludeFromEquals
  type: ResourceType = CONTENT_SOURCE;

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
  };
}
