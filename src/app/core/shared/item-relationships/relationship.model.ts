import { Observable } from 'rxjs';
import { link } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { HALLink } from '../hal-link.model';
import { Item } from '../item.model';
import { ITEM } from '../item.resource-type';
import { RelationshipType } from './relationship-type.model';
import { RELATIONSHIP_TYPE } from './relationship-type.resource-type';
import { RELATIONSHIP } from './relationship.resource-type';

/**
 * Describes a Relationship between two Items
 */
export class Relationship implements CacheableObject {
  static type = RELATIONSHIP;

  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The universally unique identifier of this Relationship
   */
  uuid: string;

  /**
   * The identifier of this Relationship
   */
  id: string;

  /**
   * The place of the Item to the left side of this Relationship
   */
  leftPlace: number;

  /**
   * The place of the Item to the right side of this Relationship
   */
  rightPlace: number;

  /**
   * The name variant of the Item to the left side of this Relationship
   */
  leftwardValue: string;

  /**
   * The name variant of the Item to the right side of this Relationship
   */
  rightwardValue: string;

  /**
   * The item to the left of this relationship
   */

  @link(ITEM)
  leftItem?: Observable<RemoteData<Item>>;

  /**
   * The item to the right of this relationship
   */
  @link(ITEM)
  rightItem?: Observable<RemoteData<Item>>;

  /**
   * The type of Relationship
   */
  @link(RELATIONSHIP_TYPE)
  relationshipType?: Observable<RemoteData<RelationshipType>>;

  _links: {
    self: HALLink,
    leftItem: HALLink,
    rightItem: HALLink,
    relationshipType: HALLink,
  }

}
