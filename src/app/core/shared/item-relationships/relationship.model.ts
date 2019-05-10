import { Observable } from 'rxjs';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { RelationshipType } from './relationship-type.model';
import { Item } from '../item.model';

/**
 * Describes a Relationship between two Items
 */
export class Relationship implements CacheableObject {
  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The type of Resource this is
   */
  type: ResourceType;

  /**
   * The universally unique identifier of this Relationship
   */
  uuid: string;

  /**
   * The identifier of this Relationship
   */
  id: string;

  /**
   * The item to the left of this relationship
   */
  leftItem: Observable<RemoteData<Item>>;

  /**
   * The item to the right of this relationship
   */
  rightItem: Observable<RemoteData<Item>>;

  /**
   * The place of the Item to the left side of this Relationship
   */
  leftPlace: number;

  /**
   * The place of the Item to the right side of this Relationship
   */
  rightPlace: number;

  /**
   * The type of Relationship
   */
  relationshipType: Observable<RemoteData<RelationshipType>>;
}
