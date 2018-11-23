import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { EntityType } from '../../../shared/entities/entity-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';

/**
 * Normalized model class for a DSpace EntityType
 */
@mapsTo(EntityType)
@inheritSerialization(NormalizedObject)
export class NormalizedEntityType extends NormalizedObject {

  /**
   * The label that describes the ResourceType of the Entity
   */
  @autoserialize
  label: string;

  /**
   * The identifier of this EntityType
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier of this EntityType
   */
  @autoserializeAs(new IDToUUIDSerializer(ResourceType.EntityType), 'id')
  uuid: string;
}
