import { Injectable } from '@angular/core';
import { take, map, switchMap, concatMap, toArray } from 'rxjs/operators';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { hasValue } from '../../../shared/empty.util';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import {
  DeleteRelationship,
  RelationshipIdentifiable
} from '../../../core/data/object-updates/object-updates.reducer';
import { RemoteData } from '../../../core/data/remote-data';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { EMPTY, Observable } from 'rxjs';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Item } from '../../../core/shared/item.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class EditItemRelationshipsService {
  public notificationsPrefix = 'static-pages.form.notification';

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public notificationsService: NotificationsService,
    protected modalService: NgbModal,
    public relationshipService: RelationshipDataService,
    public entityTypeService: EntityTypeDataService,
    public translateService: TranslateService,
  ) { }


  /**
   * Resolve the currently selected related items back to relationships and send a delete request for each of the relationships found
   * Make sure the lists are refreshed afterwards and notifications are sent for success and errors
   */
  public submit(item: Item, url: string): void {
    this.objectUpdatesService.getFieldUpdates(url, [], true).pipe(
      map((fieldUpdates: FieldUpdates) =>
        Object.values(fieldUpdates)
          .filter((fieldUpdate: FieldUpdate) => hasValue(fieldUpdate))
          .filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.ADD || fieldUpdate.changeType === FieldChangeType.REMOVE)
      ),
      take(1),
      // emit each update in the array separately
      switchMap((updates) => updates),
      // process each update one by one, while waiting for the previous to finish
      concatMap((update: FieldUpdate) => {
        if (update.changeType === FieldChangeType.REMOVE) {
          return this.deleteRelationship(update.field as DeleteRelationship).pipe(take(1));
        } else if (update.changeType === FieldChangeType.ADD) {
          return this.addRelationship(update.field as RelationshipIdentifiable).pipe(
            take(1),
            switchMap((relationshipRD: RemoteData<Relationship>) => {
              if (relationshipRD.hasSucceeded) {
                // Set the newly related item to stale, so its relationships will update to include
                // the new one. Only set the current item to stale at the very end so we only do it
                // once
                const { leftItem, rightItem } = relationshipRD.payload._links;
                if (leftItem.href === item.self) {
                  return this.itemService.invalidateByHref(rightItem.href).pipe(
                    // when it's invalidated, emit the original relationshipRD for use in the pipe below
                    map(() => relationshipRD)
                  );
                } else {
                  return this.itemService.invalidateByHref(leftItem.href).pipe(
                    // when it's invalidated, emit the original relationshipRD for use in the pipe below
                    map(() => relationshipRD)
                  );
                }
              } else {
                return [relationshipRD];
              }
            })
          );
        } else {
          return EMPTY;
        }
      }),
      toArray(),
      switchMap((responses) => {
        // once all relationships are made and all related items have been invalidated, invalidate
        // the current item
        return this.itemService.invalidateByHref(item.self).pipe(
          map(() => responses)
        );
      })
    ).subscribe((responses) => {
      if (responses.length > 0) {
        this.initializeOriginalFields(item, url);
        this.displayNotifications(responses);
        this.modalService.dismissAll();
      }
    });
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields(item: Item, url: string) {
    return this.relationshipService.getRelatedItems(item).pipe(
      take(1),
    ).subscribe((items: Item[]) => {
      this.objectUpdatesService.initialize(url, items, item.lastModified);
    });
  }

  deleteRelationship(deleteRelationship: DeleteRelationship): Observable<RemoteData<NoContent>> {
    let copyVirtualMetadata: string;
    if (deleteRelationship.keepLeftVirtualMetadata && deleteRelationship.keepRightVirtualMetadata) {
      copyVirtualMetadata = 'all';
    } else if (deleteRelationship.keepLeftVirtualMetadata) {
      copyVirtualMetadata = 'left';
    } else if (deleteRelationship.keepRightVirtualMetadata) {
      copyVirtualMetadata = 'right';
    } else {
      copyVirtualMetadata = 'none';
    }

    return this.relationshipService.deleteRelationship(deleteRelationship.uuid, copyVirtualMetadata, false);
  }

  addRelationship(addRelationship: RelationshipIdentifiable): Observable<RemoteData<Relationship>> {
    let leftItem: Item;
    let rightItem: Item;
    let leftwardValue: string;
    let rightwardValue: string;
    if (addRelationship.originalIsLeft) {
      leftItem = addRelationship.originalItem;
      rightItem = addRelationship.relatedItem;
      leftwardValue = null;
      rightwardValue = addRelationship.nameVariant;
    } else {
      leftItem = addRelationship.relatedItem;
      rightItem = addRelationship.originalItem;
      leftwardValue = addRelationship.nameVariant;
      rightwardValue = null;
    }
    return this.relationshipService.addRelationship(addRelationship.type.id, leftItem, rightItem, leftwardValue, rightwardValue, false);
  }

  /**
   * Display notifications
   * - Error notification for each failed response with their message
   * - Success notification in case there's at least one successful response
   * @param responses
   */
  displayNotifications(responses: RemoteData<NoContent>[]) {
    const failedResponses = responses.filter((response: RemoteData<NoContent>) => response.hasFailed);
    const successfulResponses = responses.filter((response: RemoteData<NoContent>) => response.hasSucceeded);

    failedResponses.forEach((response: RemoteData<NoContent>) => {
      this.notificationsService.error(this.getNotificationTitle('failed'), response.errorMessage);
    });
    if (successfulResponses.length > 0) {
      this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
    }
  }



  /**
   * Get translated notification title
   * @param key
   */
  getNotificationTitle(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.title');
  }

  /**
   * Get translated notification content
   * @param key
   */
  getNotificationContent(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.content');

  }
}
