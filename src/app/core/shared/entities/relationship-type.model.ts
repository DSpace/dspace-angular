import { Observable } from 'rxjs/Observable';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { EntityType } from './entity-type.model';

export class RelationshipType implements CacheableObject {
  self: string;

  type: ResourceType;

  label: string;

  id: string;

  uuid: string;

  leftLabel: string;

  leftMaxCardinality: number;

  leftMinCardinality: number;

  rightLabel: string;

  rightMaxCardinality: number;

  rightMinCardinality: number;

  leftType: Observable<RemoteData<EntityType>>;

  rightType: Observable<RemoteData<EntityType>>;
}
