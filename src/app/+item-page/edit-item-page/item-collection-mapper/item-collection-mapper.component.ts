import { combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import {
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
  getSucceededRemoteData,
  toDSpaceObjectListRD
} from '../../../core/shared/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { ItemDataService } from '../../../core/data/item-data.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchService } from '../../../core/shared/search/search.service';

@Component({
  selector: 'ds-item-collection-mapper',
  styleUrls: ['./item-collection-mapper.component.scss'],
  templateUrl: './item-collection-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component for mapping collections to an item
 */
export class ItemCollectionMapperComponent implements OnInit {

  /**
   * A view on the tabset element
   * Used to switch tabs programmatically
   */
  @ViewChild('tabs', {static: false}) tabs;

  /**
   * The item to map to collections
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * Search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * List of collections to show under the "Browse" tab
   * Collections that are mapped to the item
   */
  itemCollectionsRD$: Observable<RemoteData<PaginatedList<Collection>>>;

  /**
   * List of collections to show under the "Map" tab
   * Collections that are not mapped to the item
   */
  mappedCollectionsRD$: Observable<RemoteData<PaginatedList<Collection>>>;

  /**
   * Firing this observable (shouldUpdate$.next(true)) forces the two lists to reload themselves
   * Usually fired after the lists their cache is cleared (to force a new request to the REST API)
   */
  shouldUpdate$: BehaviorSubject<boolean>;

  /**
   * Track whether at least one search has been performed or not
   * As soon as at least one search has been performed, we display the search results
   */
  performedSearch = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchConfigService: SearchConfigurationService,
              private searchService: SearchService,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService,
              private collectionDataService: CollectionDataService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item)).pipe(getSucceededRemoteData()) as Observable<RemoteData<Item>>;
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.loadCollectionLists();
  }

  /**
   * Load itemCollectionsRD$ with a fixed scope to only obtain the collections that own this item
   * Load mappedCollectionsRD$ to only obtain collections that don't own this item
   */
  loadCollectionLists() {
    this.shouldUpdate$ = new BehaviorSubject<boolean>(true);
    this.itemCollectionsRD$ = observableCombineLatest(this.itemRD$, this.shouldUpdate$).pipe(
      map(([itemRD, shouldUpdate]) => {
        if (shouldUpdate) {
          return itemRD.payload
        }
      }),
      switchMap((item: Item) => this.itemDataService.getMappedCollections(item.id))
    );

    const owningCollectionRD$ = this.itemRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((item: Item) => this.collectionDataService.findOwningCollectionFor(item))
    );
    const itemCollectionsAndOptions$ = observableCombineLatest(
      this.itemCollectionsRD$,
      owningCollectionRD$,
      this.searchOptions$
    );
    this.mappedCollectionsRD$ = itemCollectionsAndOptions$.pipe(
      switchMap(([itemCollectionsRD, owningCollectionRD, searchOptions]) => {
        return this.searchService.search(Object.assign(new PaginatedSearchOptions(searchOptions), {
          query: this.buildQuery([...itemCollectionsRD.payload.page, owningCollectionRD.payload], searchOptions.query),
          dsoType: DSpaceObjectType.COLLECTION
        }), 10000).pipe(
          toDSpaceObjectListRD(),
          startWith(undefined)
        );
      })
    ) as Observable<RemoteData<PaginatedList<Collection>>>;
  }

  /**
   * Map the item to the selected collections and display notifications
   * @param {string[]} ids  The list of collection UUID's to map the item to
   */
  mapCollections(ids: string[]) {
    const itemIdAndExcludingIds$ = observableCombineLatest(
      this.itemRD$.pipe(
        getSucceededRemoteData(),
        take(1),
        map((rd: RemoteData<Item>) => rd.payload),
        map((item: Item) => item.id)
      ),
      this.itemCollectionsRD$.pipe(
        getSucceededRemoteData(),
        take(1),
        map((rd: RemoteData<PaginatedList<Collection>>) => rd.payload.page),
        map((collections: Collection[]) => collections.map((collection: Collection) => collection.id))
      )
    );

    // Map the item to the collections found in ids, excluding the collections the item is already mapped to
    const responses$ = itemIdAndExcludingIds$.pipe(
      switchMap(([itemId, excludingIds]) => observableCombineLatest(this.filterIds(ids, excludingIds).map((id: string) => this.itemDataService.mapToCollection(itemId, id))))
    );

    this.showNotifications(responses$, 'item.edit.item-mapper.notifications.add');
  }

  /**
   * Remove the mapping of the item to the selected collections and display notifications
   * @param {string[]} ids  The list of collection UUID's to remove the mapping of the item for
   */
  removeMappings(ids: string[]) {
    const responses$ = this.itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload.id),
      switchMap((itemId: string) => observableCombineLatest(ids.map((id: string) => this.itemDataService.removeMappingFromCollection(itemId, id))))
    );

    this.showNotifications(responses$, 'item.edit.item-mapper.notifications.remove');
  }

  /**
   * Filters ids from a given list of ids, which exist in a second given list of ids
   * @param {string[]} ids          The list of ids to filter out of
   * @param {string[]} excluding    The ids that should be excluded from the first list
   * @returns {string[]}
   */
  private filterIds(ids: string[], excluding: string[]): string[] {
    return ids.filter((id: string) => excluding.indexOf(id) < 0);
  }

  /**
   * Display notifications
   * @param {Observable<RestResponse[]>} responses$   The responses after adding/removing a mapping
   * @param {string} messagePrefix                    The prefix to build the notification messages with
   */
  private showNotifications(responses$: Observable<RestResponse[]>, messagePrefix: string) {
    responses$.subscribe((responses: RestResponse[]) => {
      const successful = responses.filter((response: RestResponse) => response.isSuccessful);
      const unsuccessful = responses.filter((response: RestResponse) => !response.isSuccessful);
      if (successful.length > 0) {
        const successMessages = observableCombineLatest(
          this.translateService.get(`${messagePrefix}.success.head`),
          this.translateService.get(`${messagePrefix}.success.content`, { amount: successful.length })
        );

        successMessages.subscribe(([head, content]) => {
          this.notificationsService.success(head, content);
        });
      }
      if (unsuccessful.length > 0) {
        const unsuccessMessages = observableCombineLatest(
          this.translateService.get(`${messagePrefix}.error.head`),
          this.translateService.get(`${messagePrefix}.error.content`, { amount: unsuccessful.length })
        );

        unsuccessMessages.subscribe(([head, content]) => {
          this.notificationsService.error(head, content);
        });
      }
      // Force an update on all lists and switch back to the first tab
      this.shouldUpdate$.next(true);
      this.switchToFirstTab();
    });
  }

  /**
   * Clear url parameters on tab change (temporary fix until pagination is improved)
   * @param event
   */
  tabChange(event) {
    this.performedSearch = false;
    this.router.navigateByUrl(this.getCurrentUrl());
  }

  /**
   * Get current url without parameters
   * @returns {string}
   */
  getCurrentUrl(): string {
    if (this.router.url.indexOf('?') > -1) {
      return this.router.url.substring(0, this.router.url.indexOf('?'));
    }
    return this.router.url;
  }

  /**
   * Build a query to exclude collections from
   * @param collections     The collections their UUIDs
   * @param query           The query to add to it
   */
  buildQuery(collections: Collection[], query: string): string {
    let result = query;
    for (const collection of collections) {
      result = this.addExcludeCollection(collection.id, result);
    }
    return result;
  }

  /**
   * Add an exclusion of a collection to a query
   * @param collectionId    The collection's UUID
   * @param query           The query to add the exclusion to
   */
  addExcludeCollection(collectionId: string, query: string): string {
    const excludeQuery = `-search.resourceid:${collectionId}`;
    if (isNotEmpty(query)) {
      return `${query} AND ${excludeQuery}`;
    } else {
      return excludeQuery;
    }
  }

  /**
   * Switch the view to focus on the first tab
   */
  switchToFirstTab() {
    this.tabs.select('browseTab');
  }

  /**
   * When a cancel event is fired, return to the item page
   */
  onCancel() {
    this.itemRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    ).subscribe((item: Item) => {
      this.router.navigate(['/items/', item.id])
    });
  }

}
