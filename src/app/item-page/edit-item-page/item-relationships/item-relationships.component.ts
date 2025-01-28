import {
  AsyncPipe,
  NgForOf,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
} from 'rxjs/operators';

import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { RelationshipTypeDataService } from '../../../core/data/relationship-type-data.service';
import { RequestService } from '../../../core/data/request.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { VarDirective } from '../../../shared/utils/var.directive';
import { compareArraysUsingIds } from '../../simple/item-types/shared/item-relationships-utils';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { EditItemRelationshipsService } from './edit-item-relationships.service';
import { EditRelationshipListComponent } from './edit-relationship-list/edit-relationship-list.component';
import { EditRelationshipListWrapperComponent } from './edit-relationship-list-wrapper/edit-relationship-list-wrapper.component';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    EditRelationshipListComponent,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
    EditRelationshipListWrapperComponent,
  ],
  standalone: true,
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
      this.relationshipTypes$ = this.relationshipTypeService.searchByEntityType(label, true, true, ...this.getRelationshipTypeFollowLinks()).pipe(
        map((relationshipTypes: PaginatedList<RelationshipType>) => relationshipTypes.page),
        distinctUntilChanged(compareArraysUsingIds()),
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
      followLink('rightType'),
    ];
  }

}
