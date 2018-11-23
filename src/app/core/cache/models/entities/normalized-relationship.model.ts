import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { Relationship } from '../../../shared/entities/relationship.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';

/**
 * Normalized model class for a DSpace Relationship
 */
@mapsTo(Relationship)
@inheritSerialization(NormalizedObject)
export class NormalizedRelationship extends NormalizedObject {

  /**
   * The identifier of this Relationship
   */
  @autoserialize
  id: string;

  /**
   * The identifier of the Relationship to the left side of this Relationship
   */
  @autoserialize
  leftId: string;

  @autoserialize
  place: number;

  /**
   * The identifier of the Relationship to the right side of this Relationship
   */
  @autoserialize
  rightId: string;

  /**
   * The type of Relationship
   */
  @autoserialize
  @relationship(ResourceType.RelationshipType, false)
  relationshipType: string;

  /**
   * The universally unique identifier of this Relationship
   */
  @autoserializeAs(new IDToUUIDSerializer(ResourceType.Relationship), 'id')
  uuid: string;
}
