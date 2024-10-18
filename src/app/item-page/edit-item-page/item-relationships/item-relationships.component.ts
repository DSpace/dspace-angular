import { ChangeDetectorRef, Component } from '@angular/core';

import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { followLink } from '../../../shared/utils/follow-link-config.model';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { RequestService } from '../../../core/data/request.service';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { RelationshipTypeDataService } from '../../../core/data/relationship-type-data.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditItemRelationshipsService } from './edit-item-relationships.service';
import { compareArraysUsingIds } from '../../simple/item-types/shared/item-relationships-utils';
import { AlertType } from '../../../shared/alert/alert-type';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
})
/**
 * Component for displaying an item's relationships edit page
 */
export class ItemRelationshipsComponent extends AbstractItemUpdateComponent {


  /**
   * The allowed relationship types for this type of item as an observable list
   */
  relationshipTypes$: Observable<RelationshipType[]>;

  /**
   * The item's entity type as an observable
   */
  entityType$: BehaviorSubject<ItemType> = new BehaviorSubject(undefined);

  get isSaving$(): BehaviorSubject<boolean> {
    return this.editItemRelationshipsService.isSaving$;
  }

  readonly AlertType = AlertType;

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public relationshipService: RelationshipDataService,
    public objectCache: ObjectCacheService,
    public requestService: RequestService,
    public entityTypeService: EntityTypeDataService,
    protected relationshipTypeService: RelationshipTypeDataService,
    public cdr: ChangeDetectorRef,
    protected modalService: NgbModal,
    protected editItemRelationshipsService: EditItemRelationshipsService,
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
  }

  /**
   * Initialize the values and updates of the current item's relationship fields
   */
  public initializeUpdates(): void {

    const label = this.item.firstMetadataValue('dspace.entity.type');
    if (label !== undefined) {
      this.relationshipTypes$ = this.relationshipTypeService.searchByEntityType(label, true, true, ...this.getRelationshipTypeFollowLinks())
      .pipe(
        map((relationshipTypes: PaginatedList<RelationshipType>) => relationshipTypes.page),
        distinctUntilChanged(compareArraysUsingIds())
      );

      this.entityTypeService.getEntityTypeByLabel(label).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ).subscribe((type) => this.entityType$.next(type));

    } else {
      this.entityType$.next(undefined);
    }
  }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.relationships.notifications.';
  }

  /**
   * Resolve the currently selected related items back to relationships and send a delete request for each of the relationships found
   * Make sure the lists are refreshed afterwards and notifications are sent for success and errors
   */
  public submit(): void {
    this.editItemRelationshipsService.submit(this.item, this.url);
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    return this.editItemRelationshipsService.initializeOriginalFields(this.item, this.url);
  }


  /**
   * Method to prevent unnecessary for loop re-rendering
   */
  trackById(index: number, relationshipType: RelationshipType): string {
    return relationshipType.id;
  }

  getRelationshipTypeFollowLinks() {
    return [
      followLink('leftType'),
      followLink('rightType')
    ];
  }

}
