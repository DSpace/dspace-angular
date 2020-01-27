import { Observable } from 'rxjs';
import { link } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { HALLink } from '../hal-link.model';
import { ItemType } from './item-type.model';
import { ITEM_TYPE } from './item-type.resource-type';
import { RELATIONSHIP_TYPE } from './relationship-type.resource-type';

/**
 * Describes a type of Relationship between multiple possible Items
 */
export class RelationshipType implements CacheableObject {
  static type = RELATIONSHIP_TYPE;

  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The label that describes this RelationshipType
   */
  label: string;

  /**
   * The identifier of this RelationshipType
   */
  id: string;

  /**
   * The universally unique identifier of this RelationshipType
   */
  uuid: string;

  /**
   * The label that describes the Relation to the left of this RelationshipType
   */
  leftwardType: string;

  /**
   * The maximum amount of Relationships allowed to the left of this RelationshipType
   */
  leftMaxCardinality: number;

  /**
   * The minimum amount of Relationships allowed to the left of this RelationshipType
   */
  leftMinCardinality: number;

  /**
   * The label that describes the Relation to the right of this RelationshipType
   */
  rightwardType: string;

  /**
   * The maximum amount of Relationships allowed to the right of this RelationshipType
   */
  rightMaxCardinality: number;

  /**
   * The minimum amount of Relationships allowed to the right of this RelationshipType
   */
  rightMinCardinality: number;

  /**
   * The type of Item found to the left of this RelationshipType
   */
  @link(ITEM_TYPE)
  leftType?: Observable<RemoteData<ItemType>>;

  /**
   * The type of Item found to the right of this RelationshipType
   */
  @link(ITEM_TYPE)
  rightType?: Observable<RemoteData<ItemType>>;

  _links: {
    self: HALLink,
    leftType: HALLink,
    rightType: HALLink,
  }
}
