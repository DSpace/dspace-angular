import { Observable } from 'rxjs/Observable';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { RelationshipType } from './relationship-type.model';

/**
 * Describes a Relationship between two Entities
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
   * The identifier of the Entity to the left side of this Relationship
   */
  leftId: string;

  /**
   * The identifier of the Entity to the right side of this Relationship
   */
  rightId: string;

  /**
   * The place of the Entity to the left side of this Relationship
   */
  leftPlace: number;

  /**
   * The place of the Entity to the right side of this Relationship
   */
  rightPlace: number;

  /**
   * The type of Relationship
   */
  relationshipType: Observable<RemoteData<RelationshipType>>;
}
