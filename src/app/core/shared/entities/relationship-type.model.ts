import { Observable } from 'rxjs/Observable';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { EntityType } from './entity-type.model';

export class RelationshipType implements CacheableObject {
  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The type of Resource this is
   */
  type: ResourceType;

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
   * The type of Entity found to the left of this RelationshipType
   */
  leftType: Observable<RemoteData<EntityType>>;

  /**
   * The type of Entity found to the right of this RelationshipType
   */
  rightType: Observable<RemoteData<EntityType>>;
}
