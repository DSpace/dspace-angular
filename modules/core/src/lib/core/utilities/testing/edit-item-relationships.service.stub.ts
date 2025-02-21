/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
import {
  Observable,
  Subscription,
} from 'rxjs';

import {
  DeleteRelationship,
  RelationshipIdentifiable,
} from '../../data';
import { RemoteData } from '../../data';
import { Item } from '../../shared';
import { Relationship } from '../../shared';
import { NoContent } from '../../shared';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';

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
