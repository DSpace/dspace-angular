/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
import {
  Observable,
  Subscription,
} from 'rxjs';

import {
  DeleteRelationship,
  RelationshipIdentifiable,
} from '../../core/data/object-updates/object-updates.reducer';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import { NoContent } from '../../core/shared/NoContent.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

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
