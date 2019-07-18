import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { RelationshipType } from '../../../shared/item-relationships/relationship-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedDSpaceObject } from '../normalized-dspace-object.model';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';
import { ItemType } from '../../../shared/item-relationships/item-type.model';

/**
 * Normalized model class for a DSpace RelationshipType
 */
@mapsTo(RelationshipType)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedRelationshipType extends NormalizedObject<RelationshipType> {
  /**
   * The identifier of this RelationshipType
   */
  @autoserialize
  id: string;

  /**
   * The label that describes the Relation to the left of this RelationshipType
   */
  @autoserialize
  leftLabel: string;

  /**
   * The maximum amount of Relationships allowed to the left of this RelationshipType
   */
  @autoserialize
  leftMaxCardinality: number;

  /**
   * The minimum amount of Relationships allowed to the left of this RelationshipType
   */
  @autoserialize
  leftMinCardinality: number;

  /**
   * The label that describes the Relation to the right of this RelationshipType
   */
  @autoserialize
  rightLabel: string;

  /**
   * The maximum amount of Relationships allowed to the right of this RelationshipType
   */
  @autoserialize
  rightMaxCardinality: number;

  /**
   * The minimum amount of Relationships allowed to the right of this RelationshipType
   */
  @autoserialize
  rightMinCardinality: number;

  /**
   * The type of Item found to the left of this RelationshipType
   */
  @autoserialize
  @relationship(ItemType, false)
  leftType: string;

  /**
   * The type of Item found to the right of this RelationshipType
   */
  @autoserialize
  @relationship(ItemType, false)
  rightType: string;

  /**
   * The universally unique identifier of this RelationshipType
   */
  @autoserializeAs(new IDToUUIDSerializer(RelationshipType.type.value), 'id')
  uuid: string;
}
