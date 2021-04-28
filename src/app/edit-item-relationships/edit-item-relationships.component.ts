import { Component, OnInit,Inject, InjectionToken } from '@angular/core';

import { RelationshipService  } from '../core/data/relationship.service';
import { RelationshipType } from '../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../core/shared/item-relationships/relationship.model';
import { defaultIfEmpty, filter, map, mergeMap, switchMap, take,tap,first, mergeAll } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import { LinkService } from '../core/cache/builders/link.service';

import {
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
  getFirstCompletedRemoteData
} from '../core/shared/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn4xx } from '../core/shared/operators';
import { fadeInOut } from '../shared/animations/fade';
import { AuthService } from '../core/auth/auth.service';
import { EntityTypeService } from '../core/data/entity-type.service';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { RelationshipsConfigurationService } from './relationships-configuration.service';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';

import { MyDSpaceRequest } from '../core/data/request.models';

import { Context } from '../core/shared/context.model';

import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SearchResult } from '../shared/search/search-result.model';

import {
  combineLatest as observableCombineLatest,
  combineLatest,
  BehaviorSubject,
  Observable,
  of as observableOf,
  zip as observableZip,
} from 'rxjs';

export const SEARCH_CONFIG_SERVICE: InjectionToken<SearchConfigurationService> = new InjectionToken<SearchConfigurationService>('searchConfigurationService');


@Component({
  selector: 'ds-edit-item-relationships',
  templateUrl: './edit-item-relationships.component.html',
  styleUrls: ['./edit-item-relationships.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: RelationshipsConfigurationService
    }
  ]
})
export class EditItemRelationshipsComponent implements OnInit {


  /**
   * Item as observable Remot Data
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * Item that is being checked for relationships
   */
  item: Item;

  /**
   * The relationship type of the item
   */
  itemType: string;

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
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * The list of available configuration options
   */
  configurationList$: Observable<SearchConfigurationOption[]>;

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

  constructor(protected relationshipService: RelationshipService,
    private route: ActivatedRoute,
    private authService: AuthService,
    protected entityTypeService: EntityTypeService,
    protected linkService: LinkService,
    private service: SearchService,
    private router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: RelationshipsConfigurationService) {

    this.relationshipType = this.route.snapshot.params.type;
    // this.service.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);

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

    this.itemRD$.pipe(first()).subscribe((rd) => {
        this.item = rd.payload;

        this.itemType = this.item.firstMetadataValue('dspace.entity.type');
        const relationshipConfig = 'RELATION.' + this.itemType + '.' + this.relationshipType;

        this.searchConfigService.setOptions(relationshipConfig,this.item.id);

        this.getResults();

        this.getEntityType();

        this.getRelationships$();
      }
    );

  }

  /**
   * Get all results of the relation to manage
   */
  getResults(): void {
    this.configurationList$ = this.searchConfigService.getAvailableConfigurationOptions();
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.searchOptions$.pipe(
      tap(() => this.resultsRD$.next(null)),
      switchMap((options: PaginatedSearchOptions) => this.service.search(options).pipe(getFirstSucceededRemoteData())))
      .subscribe((results) => {
        console.log(results);
        this.resultsRD$.next(results);
      });
  }

  /**
   * Get all relationships of the relation to manage
   */
  getRelationships$(): void {

    this.relationshipService.getItemRelationshipsAsArrayAll(this.item,
      followLink('leftItem')
    )
    .subscribe((relationships: Relationship[]) => {
      const relations = relationships.filter((relation) => relation.leftwardValue.toLowerCase().includes(this.relationshipType));
      setTimeout( () => {
        console.log(relations);
        this.relationshipResults$.next(relations);
      }, 500);
    });
  }

  /**
   * Get all relationship types availabe to the item selected
   */
  getEntityType(): void {

      this.entityTypeService.getEntityTypeByLabel(this.itemType).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        switchMap((entityType) => this.entityTypeService.getEntityTypeRelationships(entityType.id)),
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        map((relationshipTypes) => relationshipTypes.page),
        take(1)
      ).subscribe( (relationshipTypes) => {
        this.relTypes = relationshipTypes;
      });

  }

  /**
   * Get the relationships of this item with a given type as an observable
   * @param relationshipType  the relationship type to filter the item's relationships on
   */
  getRelationships(relationshipType: RelationshipType): Observable<Relationship[]> {

    if (!this.relationshipsByType$.has(relationshipType)) {
      this.relationshipsByType$.set(
        relationshipType,
        this.relationshipService.getItemRelationshipsAsArrayAll(this.item).pipe(
          // filter on type
          switchMap((relationships) =>
            observableCombineLatest(
              relationships.map((relationship) => this.getRelationshipType(relationship))
            )
            .pipe(
              defaultIfEmpty([]),
              map((types) => relationships.filter(
                (relationship, index) => relationshipType.id === types[index].id
              )),
            )
          ),
        )
      );
    }

    return this.relationshipsByType$.get(relationshipType);
  }

  /**
   * Get the type of a given relationship as an observable
   * @param relationship  the relationship to get the type for
   */
  private getRelationshipType(relationship: Relationship): Observable<RelationshipType> {

    this.linkService.resolveLinks(
      relationship,
      followLink('relationshipType'),
      followLink('leftItem'),
      followLink('rightItem'),
    );
    return relationship.relationshipType.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((relationshipType: RelationshipType) => hasValue(relationshipType) && isNotEmpty(relationshipType.uuid))
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
    if ( event.action === 'select' ) {
      const relationshipType = this.relTypes.find((type) => type.leftwardType.toLowerCase().includes('select') && type.leftwardType.toLowerCase().includes(this.relationshipType));
      this.addRelationship(relationshipType, event.item);
    } else if ( event.action === 'hide' ) {
      const relationshipType = this.relTypes.find((type) => type.leftwardType.toLowerCase().includes('hidden') && type.leftwardType.toLowerCase().includes(this.relationshipType));
      this.addRelationship(relationshipType, event.item);
    } else {
      this.deleteRelationship(event.relationship);
    }
  }


  /**
   * Request for adding relationship between two items
   * @param type  the relationship type of the relationship created
   * @param ojbectItem  the relationship type of the relationship created
   */
  addRelationship(type: RelationshipType, objectItem: Item): void {
    this.relationshipService.addRelationship(type.id, objectItem, this.item, type.leftwardType, type.rightwardType).subscribe((res) => {
      this.getRelationships$();
    });
  }

  /**
   * Request for updating relationship place/sort
   * @param relationship  the relationship to update place
   */
  updateRelationship(relationship: Relationship): void {
    this.relationshipService.updateRightPlace(relationship).subscribe((res) => {
      console.log(res);
    },(err) => {
      this.getRelationships$();
    });
  }

  /**
   * Request for deleting relationship
   * @param relationship  the relationship to delete
   */
  deleteRelationship(relationship: Relationship): void {
    this.relationshipService.deleteRelationship(relationship.id).subscribe((res) => {
      this.getRelationships$();
    });
  }



}
