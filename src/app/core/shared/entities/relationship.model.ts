import { Observable } from 'rxjs/Observable';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../resource-type';
import { RelationshipType } from './relationship-type.model';

export class Relationship implements CacheableObject {
  self: string;

  type: ResourceType;

  uuid: string;

  id: string;

  leftId: string;

  place: string;

  rightId: string;

  relationshipType: Observable<RemoteData<RelationshipType>>;
}
