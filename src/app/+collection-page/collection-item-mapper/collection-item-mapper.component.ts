import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Collection } from '../../core/shared/collection.model';
import { SearchConfigurationService } from '../../+search-page/search-service/search-configuration.service';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { getSucceededRemoteData, toDSpaceObjectListRD } from '../../core/shared/operators';
import { SearchService } from '../../+search-page/search-service/search.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RestResponse } from '../../core/cache/response-cache.models';
import { TranslateService } from '@ngx-translate/core';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-collection-item-mapper',
  styleUrls: ['./collection-item-mapper.component.scss'],
  templateUrl: './collection-item-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Collection used to map items to a collection
 */
export class CollectionItemMapperComponent implements OnInit {

  /**
   * The collection to map items to
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  /**
   * Search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * List of items to show under the "Browse" tab
   * Items inside the collection
   */
  collectionItemsRD$: Observable<RemoteData<PaginatedList<DSpaceObject>>>;

  /**
   * List of items to show under the "Map" tab
   * Items outside the collection
   */
  mappingItemsRD$: Observable<RemoteData<PaginatedList<DSpaceObject>>>;

  /**
   * Sort on title ASC by default
   * @type {SortOptions}
   */
  defaultSortOptions: SortOptions = new SortOptions('dc.title', SortDirection.ASC);

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
    this.collectionRD$ = this.route.data.map((data) => data.collection).pipe(getSucceededRemoteData()) as Observable<RemoteData<Collection>>;
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.loadItemLists();
  }

  /**
   * Load collectionItemsRD$ with a fixed scope to only obtain the items this collection owns
   * Load mappingItemsRD$ to only obtain items this collection doesn't own
   *  TODO: When the API support it, fetch items excluding the collection's scope (currently fetches all items)
   */
  loadItemLists() {
    const collectionAndOptions$ = Observable.combineLatest(
      this.collectionRD$,
      this.searchOptions$
    );
    this.collectionItemsRD$ = collectionAndOptions$.pipe(
      switchMap(([collectionRD, options]) => {
        return this.collectionDataService.getMappedItems(collectionRD.payload.id, Object.assign(options, {
          sort: this.defaultSortOptions
        }))
      })
    );
    this.mappingItemsRD$ = this.searchOptions$.pipe(
      flatMap((options: PaginatedSearchOptions) => {
        return this.searchService.search(Object.assign(options, {
          scope: undefined,
          dsoType: DSpaceObjectType.ITEM,
          sort: this.defaultSortOptions
        }));
      }),
      toDSpaceObjectListRD()
    );
  }

  /**
   * Map the selected items to the collection and display notifications
   * @param {string[]} ids  The list of item UUID's to map to the collection
   */
  mapItems(ids: string[]) {
    const responses$ = this.collectionRD$.pipe(
      getSucceededRemoteData(),
      map((collectionRD: RemoteData<Collection>) => collectionRD.payload.id),
      switchMap((collectionId: string) => Observable.combineLatest(ids.map((id: string) => this.itemDataService.mapToCollection(id, collectionId))))
    );

    responses$.subscribe((responses: RestResponse[]) => {
      const successful = responses.filter((response: RestResponse) => response.isSuccessful);
      const unsuccessful = responses.filter((response: RestResponse) => !response.isSuccessful);
      if (successful.length > 0) {
        const successMessages = Observable.combineLatest(
          this.translateService.get('collection.item-mapper.notifications.success.head'),
          this.translateService.get('collection.item-mapper.notifications.success.content', { amount: successful.length })
        );

        successMessages.subscribe(([head, content]) => {
          this.notificationsService.success(head, content);
        });
      }
      if (unsuccessful.length > 0) {
        const unsuccessMessages = Observable.combineLatest(
          this.translateService.get('collection.item-mapper.notifications.error.head'),
          this.translateService.get('collection.item-mapper.notifications.error.content', { amount: unsuccessful.length })
        );

        unsuccessMessages.subscribe(([head, content]) => {
          this.notificationsService.error(head, content);
        });
      }
    });
  }

  /**
   * Remove the mapping for the selected items to the collection and display notifications
   * @param {string[]} ids  The list of item UUID's to remove the mapping to the collection
   */
  unmapItems(ids: string[]) {
    // TODO: Functionality for unmapping items
  }

  /**
   * Clear url parameters on tab change (temporary fix until pagination is improved)
   * @param event
   */
  tabChange(event) {
    // TODO: Fix tabs to maintain their own pagination options (once the current pagination system is improved)
    // Temporary solution: Clear url params when changing tabs
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

}
