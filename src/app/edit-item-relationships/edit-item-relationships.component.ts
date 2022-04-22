import { Component, OnDestroy, OnInit } from '@angular/core';

import { RelationshipService } from '../core/data/relationship.service';
import { RelationshipType } from '../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../core/shared/item-relationships/relationship.model';
import { map, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';

import {
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../core/shared/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { EntityTypeService } from '../core/data/entity-type.service';

import { Context } from '../core/shared/context.model';
import { HostWindowService } from '../shared/host-window.service';

import { BehaviorSubject, Observable, Subscription, } from 'rxjs';
import { getItemPageRoute } from '../item-page/item-page-routing-paths';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ds-edit-item-relationships',
  templateUrl: './edit-item-relationships.component.html',
  styleUrls: ['./edit-item-relationships.component.scss'],
})
export class EditItemRelationshipsComponent implements OnInit, OnDestroy {

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
   * A map which stores the relationship types of this item as observable lists
   */
  types$: Observable<RelationshipType[]>;


  /**
   * A map which stores the relationships of this item for each type as observable lists
   */

    // relationships$: Observable<Relationship[]>;

  relationshipsByType$: Map<RelationshipType, Observable<Relationship[]>>
    = new Map<RelationshipType, Observable<Relationship[]>>();

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
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(protected relationshipService: RelationshipService,
              private route: ActivatedRoute,
              private router: Router,
              protected entityTypeService: EntityTypeService,
              private windowService: HostWindowService,
              private translate: TranslateService,
              private title: Title
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

    this.itemRD$ = this.route.data.pipe(
      map((data) => data.info),
      getFirstSucceededRemoteData()
    ) as Observable<RemoteData<Item>>;

    this.getInfo();

    this.getEntityType();

    this.retrieveRelationships();

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

        const relationshipTypeTranslated = this.translate.instant( this.relationshipConfig + '.search.results.head' );

        this.title.setTitle(relationshipTypeTranslated);

        this.searchFilter = `scope=${item.id}`;
        this.isActive = true;
      })
    );
  }

  /**
   * Get all relationships of the relation to manage
   */
  retrieveRelationships(): void {
    console.log('retrieveRelationships');
    // this.subs.push(
      this.itemRD$.pipe(
        getRemoteDataPayload(),
        switchMap((item: Item) => this.relationshipService.getItemRelationshipsAsArrayAll(item,
          followLink('leftItem'),
          // followLink('relationshipType'),
        )),
        take(1)
      ).subscribe((relationships: Relationship[]) => {
        const relations = relationships
          .filter((relation) => !!relation.leftwardValue && relation.leftwardValue.toLowerCase().includes('is' + this.relationshipType));
        this.relationshipResults$.next(relations);
        this.isInit = true;
      });
      // );
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
  manageRelationship(event): void {
    if (event.action === 'select' || event.action === 'hide') {
      const relType = event.action === 'select' ? 'select' : 'hidden';
      const relationshipType = this.relTypes.find((type) => type.leftwardType.toLowerCase().includes(relType) && type.leftwardType.toLowerCase().includes('is' + this.relationshipType));

      if (!event.relationship) {
        this.addRelationship(relationshipType, event.item);
      } else {
        this.deleteAddRelationship(relationshipType, event.item, event.relationship);
      }

    } else {
      this.deleteRelationship(event.relationship);
    }
  }

  /**
   * Request for adding relationship between two items
   * @param type  the relationship type of the relationship created
   * @param objectItem  the relationship type of the relationship created
   */
  addRelationship(type: RelationshipType, objectItem: Item): void {
    this.relationshipService.addRelationship(type.id, objectItem, this.item, type.leftwardType, type.rightwardType).pipe(take(1))
      .subscribe(() => {
        this.retrieveRelationships();
      });
  }

  /**
   * Request for updating relationship place/sort
   * @param relationship  the relationship to update place
   */
  updateRelationship(relationship: Relationship): void {
    this.relationshipService.updateRightPlace(relationship).pipe(take(1)).subscribe({
      error: err => this.retrieveRelationships()
    });
  }

  /**
   * Request for deleting relationship
   * @param relationship  the relationship to delete
   */
  deleteRelationship(relationship: Relationship): void {
    this.relationshipService.deleteRelationship(relationship.id).subscribe((res) => {
      this.retrieveRelationships();
    });
  }

  /**
   * Request for deleting a relationship and then adding a new relationship between two items
   * @param type  the relationship type of the relationship created
   * @param objectItem  the relationship type of the relationship created
   * @param relationship  the relationship to delete
   */
  deleteAddRelationship(type: RelationshipType, objectItem: Item, relationship: Relationship) {
    this.relationshipService.deleteRelationship(relationship.id).pipe(take(1))
      .subscribe(() => {
        this.addRelationship(type, objectItem);
      });
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
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.isActive = false;
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
