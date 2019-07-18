import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { Relationship } from '../../../shared/item-relationships/relationship.model';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';
import { RelationshipType } from '../../../shared/item-relationships/relationship-type.model';
import { Item } from '../../../shared/item.model';

/**
 * Normalized model class for a DSpace Relationship
 */
@mapsTo(Relationship)
@inheritSerialization(NormalizedObject)
export class NormalizedRelationship extends NormalizedObject<Relationship> {

  /**
   * The identifier of this Relationship
   */
  @autoserialize
  id: string;

  /**
   * The item to the left of this relationship
   */
  @autoserialize
  @relationship(Item, false)
  leftItem: string;

  /**
   * The item to the right of this relationship
   */
  @autoserialize
  @relationship(Item, false)
  rightItem: string;

  /**
   * The place of the Item to the left side of this Relationship
   */
  @autoserialize
  leftPlace: number;

  /**
   * The place of the Item to the right side of this Relationship
   */
  @autoserialize
  rightPlace: number;

  /**
   * The type of Relationship
   */
  @autoserialize
  @relationship(RelationshipType, false)
  relationshipType: string;

  /**
   * The universally unique identifier of this Relationship
   */
  @autoserializeAs(new IDToUUIDSerializer(Relationship.type.value), 'id')
  uuid: string;
}
