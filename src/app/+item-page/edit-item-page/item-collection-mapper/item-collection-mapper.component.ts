import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Observable } from 'rxjs/Observable';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { SearchConfigurationService } from '../../../+search-page/search-service/search-configuration.service';
import { map, switchMap } from 'rxjs/operators';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RestResponse } from '../../../core/cache/response-cache.models';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

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
  itemCollectionsRD$: Observable<RemoteData<Collection[]>>;

  /**
   * List of collections to show under the "Map" tab
   * Collections that are not mapped to the item
   */
  mappingCollectionsRD$: Observable<RemoteData<PaginatedList<Collection>>>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchConfigService: SearchConfigurationService,
              private searchService: SearchService,
              private collectionDataService: CollectionDataService,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.map((data) => data.item).pipe(getSucceededRemoteData()) as Observable<RemoteData<Item>>;
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.loadCollectionLists();
  }

  /**
   * Load itemCollectionsRD$ with a fixed scope to only obtain the collections that own this item
   * Load mappingCollectionsRD$ to only obtain collections that don't own this item
   *  TODO: When the API support it, fetch collections excluding the item's scope (currently fetches all collections)
   */
  loadCollectionLists() {
    this.itemCollectionsRD$ = this.itemRD$.pipe(
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      switchMap((item: Item) => this.itemDataService.getMappedCollections(item.id))
    );
    this.mappingCollectionsRD$ = this.searchOptions$.pipe(
      switchMap((searchOptions: PaginatedSearchOptions) => this.collectionDataService.findAll(searchOptions))
    );
  }

  /**
   * Map the item to the selected collections and display notifications
   * @param {string[]} ids  The list of collection UUID's to map the item to
   */
  mapCollections(ids: string[]) {
    const responses$ = this.itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload.id),
      switchMap((itemId: string) => Observable.combineLatest(ids.map((id: string) => this.itemDataService.mapToCollection(itemId, id))))
    );

    responses$.subscribe((responses: RestResponse[]) => {
      const successful = responses.filter((response: RestResponse) => response.isSuccessful);
      const unsuccessful = responses.filter((response: RestResponse) => !response.isSuccessful);
      if (successful.length > 0) {
        const successMessages = Observable.combineLatest(
          this.translateService.get('item.edit.item-mapper.notifications.success.head'),
          this.translateService.get('item.edit.item-mapper.notifications.success.content', { amount: successful.length })
        );

        successMessages.subscribe(([head, content]) => {
          this.notificationsService.success(head, content);
        });
      }
      if (unsuccessful.length > 0) {
        const unsuccessMessages = Observable.combineLatest(
          this.translateService.get('item.edit.item-mapper.notifications.error.head'),
          this.translateService.get('item.edit.item-mapper.notifications.error.content', { amount: unsuccessful.length })
        );

        unsuccessMessages.subscribe(([head, content]) => {
          this.notificationsService.error(head, content);
        });
      }
    });
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
