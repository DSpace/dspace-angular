/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
import {
  Observable,
  Subscription,
} from 'rxjs';

import {
  DeleteRelationship,
  RelationshipIdentifiable,
} from '../data/object-updates/object-updates.reducer';
import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { NoContent } from '../shared/NoContent.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

/**
 * Stub class of {@link EditItemRelationshipsService}
 */
export class EditItemRelationshipsServiceStub {

  submit(_item: Item, _url: string): void {
  }

  initializeOriginalFields(_item: Item, _url: string): Subscription {
    return new Subscription();
  }

  deleteRelationship(_deleteRelationship: DeleteRelationship): Observable<RemoteData<NoContent>> {
    return createSuccessfulRemoteDataObject$({});
  }

  addRelationship(_addRelationship: RelationshipIdentifiable): Observable<RemoteData<Relationship>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  displayNotifications(_responses: RemoteData<NoContent>[]): void {
  }

  getNotificationTitle(_key: string): string {
    return '';
  }

  getNotificationContent(_key: string): string {
    return '';
  }

}
