import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BehaviorSubject, EMPTY, interval, Observable, race, Subscription, } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { RelationshipDataService } from '../core/data/relationship-data.service';
import { RelationshipType } from '../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../core/shared/item-relationships/relationship.model';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../core/shared/operators';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { EntityTypeDataService } from '../core/data/entity-type-data.service';
import { Context } from '../core/shared/context.model';
import { HostWindowService } from '../shared/host-window.service';
import { getItemPageRoute } from '../item-page/item-page-routing-paths';
import { AppState } from '../app.reducer';
import { EditItemRelationshipsActionTypes } from './edit-item-relationships.actions';
import { NotificationsService } from '../shared/notifications/notifications.service';

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

@Component({
  selector: 'ds-edit-item-relationships',
  templateUrl: './edit-item-relationships.component.html',
  styleUrls: ['./edit-item-relationships.component.scss'],
})
export class EditItemRelationshipsComponent implements OnInit, OnDestroy {


  /**
   * A boolean representing if hidden relationships are present
   */
  hasHiddenRelationship$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Contain the hidden relationship notice message
   */
  hiddenRelationshipMsg: string;

  /**
   * A boolean representing if component is active
   * @type {boolean}
   */
  isActive: boolean;

  /**
   * Item as observable Remote Data
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * Item that is being checked for relationships
   */
  item: Item;

  /**
   * The relationship type that is being managed
   */
  relationshipType: string;

  /**
   * A map which stores the relationships of this item for each type as observable lists
   */

  relationships$: Observable<Relationship[]>;

  /**
   * A boolean representing if search results entry are separated by a line
   */
  hasBorder = true;

  /**
   * The current context of this page: workspace or workflow
   */
  context: Context = Context.RelationshipItem;

  /**
   * The list of relationship types available for the item
   */
  relTypes: RelationshipType[] = [];

  /**
   * The list of relationships of the item
   */
  relationshipResults$: BehaviorSubject<Relationship[]> = new BehaviorSubject([]);

  /**
   * The emitter that updates the state of the items.
   * If null or undefined then updates all items in the view.
   */
  updateStatusByItemId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The relationship configuration
   */
  relationshipConfig: string;

  /**
   * The relationship configuration
   */
  searchFilter: string;
  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * A boolean representing if relationships are initialized
   */
  isInit = false;

  /**
   * Emits true when a relationship is being added, deleted, or updated
   */
  private processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Representing if any action is processing in the page result list
   */
  pendingChanges$: Observable<boolean>;

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(protected relationshipService: RelationshipDataService,
              private route: ActivatedRoute,
              private router: Router,
              protected entityTypeService: EntityTypeDataService,
              private windowService: HostWindowService,
              private translate: TranslateService,
              private title: Title,
              protected store: Store<AppState>,
              protected notification: NotificationsService
  ) {
    this.relationshipType = this.route.snapshot.params.type;
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  /**
   * On component initialization get the item object.
   * After getting object get all its relationships & relationsihp types
   * Get all results of the relation to manage
   */
  ngOnInit() {
    this.hiddenRelationshipMsg = this.translate.instant('manage.relationships.hidden-related-items-alert');
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.info),
      getFirstSucceededRemoteData()
    ) as Observable<RemoteData<Item>>;

    this.getInfo();

    this.getEntityType();

    this.retrieveRelationships().subscribe();

    this.pendingChanges$ = this.processing$.asObservable().pipe(
      tap((res) => {
        this.store.dispatch(EditItemRelationshipsActionTypes.PENDING_CHANGES({ pendingChanges: res }));
      })
    );

  }

  getInfo() {
    this.subs.push(
      this.itemRD$.pipe(
        getRemoteDataPayload(),
        take(1)
      ).subscribe((item: Item) => {
        this.item = item;
        const itemType = item.firstMetadataValue('dspace.entity.type');
        this.relationshipConfig = 'RELATION.' + itemType + '.' + this.relationshipType;

        const relationshipTypeTranslated = this.translate.instant(this.relationshipConfig + '.search.results.head');

        this.title.setTitle(relationshipTypeTranslated);

        this.searchFilter = `scope=${item.id}`;
        this.isActive = true;
      })
    );
  }

  /**
   * Get all relationships of the relation to manage
   */
  retrieveRelationships(objectItem?: Item): Observable<Relationship[]> {
    this.processing$.next(true);
    return this.itemRD$.pipe(
      getRemoteDataPayload(),
      switchMap((item: Item) => {
        // fallback for cache issue
        const fallback$ = interval(5000).pipe(
          switchMap(() => this.relationshipService.getItemRelationshipsAsArrayAll(item, followLink('leftItem')))
        );
        const relationships$ = this.relationshipService.getItemRelationshipsAsArrayAll(item, followLink('leftItem'));
        return race([relationships$, fallback$]);
      }),
      take(1),
      tap((relationships: Relationship[]) => {
        const relations = relationships
          .filter((relation) => !!relation.leftwardValue && relation.leftwardValue.toLowerCase().includes('is' + this.relationshipType));
        const hiddenRelationships = relationships.filter(filteredRelationship => filteredRelationship.leftwardValue.toLowerCase().includes('hidden'));
        this.hasHiddenRelationship$.next(hiddenRelationships.length > 0);
        this.relationshipResults$.next(relations);

        let itemId = null;
        if (objectItem != null && objectItem.id != null) {
          itemId = objectItem.id;
        }

        this.updateStatusByItemId$.next(itemId);
        this.isInit = true;

        this.processing$.next(false);
      })
    );
  }

  /**
   * Get all relationship types available to the item selected
   */
  getEntityType(): void {
    this.subs.push(
      this.itemRD$.pipe(
        getRemoteDataPayload(),
        map((item: Item) => item.firstMetadataValue('dspace.entity.type')),
        switchMap((itemType: string) => this.entityTypeService.getEntityTypeByLabel(itemType).pipe(
          getFirstSucceededRemoteDataPayload(),
          switchMap((entityType) => this.entityTypeService.getEntityTypeRelationships(entityType.id)),
          getFirstSucceededRemoteDataPayload(),
          map((relationshipTypes) => relationshipTypes.page),
          take(1)
        ))).subscribe((relationshipTypes) => {
        this.relTypes = relationshipTypes;
      })
    );
  }

  /**
   * After item is dropped set the place and start the api request
   * @param event  the event to get the relationship and place
   */
  itemDropped(event): void {
    const relationship = event.relationship;
    relationship.rightPlace = event.place;
    this.updateRelationship(relationship);
  }

  /**
   * When an action is performed manage the relationships of the item
   * @param event  the event from which comes an action type
   */
  manageRelationship(event: ManageRelationshipEvent): void {
    if (event.action === ManageRelationshipEventType.Select || event.action === ManageRelationshipEventType.Hide) {
      const relType = event.action === ManageRelationshipEventType.Select ? 'select' : 'hidden';
      const relationshipType = this.relTypes.find((type) => type.leftwardType.toLowerCase().includes(relType) && type.leftwardType.toLowerCase().includes('is' + this.relationshipType));

      if (!event.relationship) {
        this.addRelationship(relationshipType, event.item, event.action).subscribe();
      } else {
        this.deleteAddRelationship(relationshipType, event.item, event.relationship, event.action).subscribe();
      }
    } else if (event.action === ManageRelationshipEventType.Unhide || event.action === ManageRelationshipEventType.Unselect) {
      this.deleteRelationship(event.relationship, event.item, event.action);
    }

    console.warn(`Unhandled action ${event.action}`);
  }

  /**
   * Request for adding relationship between two items
   * @param type  the relationship type of the relationship created
   * @param objectItem  the relationship type of the relationship created
   * @param action  The action type
   */
  addRelationship(type: RelationshipType, objectItem: Item, action: ManageRelationshipEventType): Observable<Relationship[]> {
    this.processing$.next(true);
    return this.relationshipService.addRelationship(type.id, objectItem, this.item, type.leftwardType, type.rightwardType).pipe(take(1)).pipe(
      switchMap((rd: RemoteData<Relationship>) => {
        if (rd.hasSucceeded) {
          return this.retrieveRelationships(objectItem);
        } else {
          this.processing$.next(false);
          this.updateStatusByItemId$.next(null);
          this.notification.error(null, this.getErrMsgByAction(action));
          return EMPTY;
        }
      })
    );
  }

  /**
   * Request for updating relationship place/sort
   * @param relationship  the relationship to update place
   */
  updateRelationship(relationship: Relationship): void {
    this.processing$.next(true);
    this.relationshipService.updateRightPlace(relationship).pipe(
      getFirstCompletedRemoteData()
    ).pipe(
      switchMap((rd: RemoteData<Relationship>) => {
        if (rd.hasSucceeded) {
          return this.retrieveRelationships();
        } else {
          this.processing$.next(false);
          this.updateStatusByItemId$.next(null);
          this.notification.error(null, this.getErrMsgByAction(ManageRelationshipEventType.Sort));
          return EMPTY;
        }
      })
    ).subscribe();
  }

  /**
   * Request for deleting relationship
   * @param relationship  the relationship to delete
   * @param objectItem the reference to the objectItem that owns the relationship
   * @param action  The action type
   */
  deleteRelationship(relationship: Relationship, objectItem: Item, action: ManageRelationshipEventType): void {
    this.processing$.next(true);
    this.relationshipService.deleteRelationship(relationship.id).pipe(take(1)).pipe(
      switchMap((rd: RemoteData<Relationship>) => {
        if (rd.hasSucceeded) {
          return this.retrieveRelationships(objectItem);
        } else {
          this.processing$.next(false);
          this.updateStatusByItemId$.next(null);
          this.notification.error(null, this.getErrMsgByAction(action));
          return EMPTY;
        }
      })
    ).subscribe();
  }

  /**
   * Request for deleting a relationship and then adding a new relationship between two items
   * @param type  the relationship type of the relationship created
   * @param objectItem  the relationship type of the relationship created
   * @param relationship  the relationship to delete
   * @param action  The action type
   */
  deleteAddRelationship(type: RelationshipType, objectItem: Item, relationship: Relationship, action: ManageRelationshipEventType): Observable<Relationship[]> {
    this.processing$.next(true);
    return this.relationshipService.deleteRelationship(relationship.id).pipe(take(1)).pipe(
      switchMap((rd: RemoteData<Relationship>) => {
        if (rd.hasSucceeded) {
          return this.addRelationship(type, objectItem, action);
        } else {
          this.processing$.next(false);
          const errMsg = (action === 'unselect') ? 'manage.relationships.error.unselect' : 'manage.relationships.error.unhide';
          this.notification.error(null, errMsg);
          return EMPTY;
        }
      })
    );
  }

  /**
   * It is used for hide/show the right relationship list
   */
  toggleSidebar(): void {
    this.sidebarStatus$.next(!this.sidebarStatus$.value);
  }

  /**
   * Return the relationship list status
   */
  isSideBarHidden(): Observable<boolean> {
    return this.sidebarStatus$.asObservable().pipe(
      map((status: boolean) => !status)
    );
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    this.router.navigateByUrl(getItemPageRoute(this.item));
  }

  /**
   * return the i18n error message label according to the action type
   * @param action
   * @private
   */
  private getErrMsgByAction(action: ManageRelationshipEventType): string {
    let label;
    switch (action) {
      case ManageRelationshipEventType.Select:
        label = 'manage.relationships.error.select';
        break;
      case ManageRelationshipEventType.Unselect:
        label = 'manage.relationships.error.unselect';
        break;
      case ManageRelationshipEventType.Hide:
        label = 'manage.relationships.error.hide';
        break;
      case ManageRelationshipEventType.Unhide:
        label = 'manage.relationships.error.unhide';
        break;
      case ManageRelationshipEventType.Sort:
        label = 'manage.relationships.error.sort';
        break;
    }

    return this.translate.instant(label);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.isActive = false;
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
