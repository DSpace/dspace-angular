import { BehaviorSubject } from 'rxjs';

import { Item } from '../core/shared/item.model';
import { Relationship } from '../core/shared/item-relationships/relationship.model';

export enum ManageRelationshipEventType {
  Select = 'select',
  Unselect = 'unselect',
  Hide = 'hide',
  Unhide = 'unhide',
  Sort = 'sort'
}

export interface ManageRelationshipEvent {
  action: ManageRelationshipEventType;
  item: Item;
  relationship: Relationship;
  place?: number
}

export interface ManageRelationshipCustomData {
  relationships$: BehaviorSubject<Relationship[]>;
  entityType: string;
  updateStatusByItemId$: BehaviorSubject<string>;
}
