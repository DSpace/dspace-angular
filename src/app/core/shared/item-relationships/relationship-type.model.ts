import { Observable } from 'rxjs';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { ItemType } from './item-type.model';

/**
 * Describes a type of Relationship between multiple possible Items
 */
export class RelationshipType implements CacheableObject {
  static type = new ResourceType('relationshiptype');

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
  leftLabel: string;

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
  rightLabel: string;

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
  leftType: Observable<RemoteData<ItemType>>;

  /**
   * The type of Item found to the right of this RelationshipType
   */
  rightType: Observable<RemoteData<ItemType>>;
}
