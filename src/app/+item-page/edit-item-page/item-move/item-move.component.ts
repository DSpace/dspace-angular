import {Component, OnInit} from '@angular/core';
import {SearchService} from '../../../+search-page/search-service/search.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {DSpaceObjectType} from '../../../core/shared/dspace-object-type.model';
import {SearchOptions} from '../../../+search-page/search-options.model';
import {RemoteData} from '../../../core/data/remote-data';
import {DSpaceObject} from '../../../core/shared/dspace-object.model';
import {PaginatedList} from '../../../core/data/paginated-list';
import {SearchResult} from '../../../+search-page/search-result.model';
import {PaginatedSearchOptions} from '../../../+search-page/paginated-search-options.model';
import {Item} from '../../../core/shared/item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {CollectionDataService} from '../../../core/data/collection-data.service';
import {SearchConfigurationService} from '../../../+search-page/search-service/search-configuration.service';
import {TranslateService} from '@ngx-translate/core';
import {getSucceededRemoteData} from '../../../core/shared/operators';
import {ItemDataService} from '../../../core/data/item-data.service';
import {RestResponse} from '../../../core/cache/response-cache.models';
import {getItemEditPath} from '../../item-page-routing.module';

@Component({
  selector: 'ds-item-move',
  templateUrl: './item-move.component.html'
})
export class ItemMoveComponent implements OnInit {

  inheritPolicies = false;
  itemRD$: Observable<RemoteData<Item>>;
  /**
   * Search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;
  filterSearchResults: Observable<any[]> = Observable.of([]);
  selectedCollection: string;

  selectedCollectionId: string;
  itemId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private collectionDataService: CollectionDataService,
              private itemDataService: ItemDataService,
              private searchConfigService: SearchConfigurationService,
              private searchService: SearchService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.map((data) => data.item).pipe(getSucceededRemoteData()) as Observable<RemoteData<Item>>;
    this.itemRD$.first().subscribe((rd) => {
        this.itemId = rd.payload.id;
      }
    );
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.loadSuggestions('');
  }

  findSuggestions(query): void {
    this.loadSuggestions(query);
  }

  /**
   * Load all available collections to move the item to.
   *  TODO: When the API support it, only fetch collections where user has ADD rights to.
   */
  loadSuggestions(query): void {
    this.filterSearchResults = this.searchService.search(new SearchOptions({
      dsoType: DSpaceObjectType.COLLECTION,
      query: query
    })).first().pipe(
      map((rd: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
        return rd.payload.page.map((searchResult) => {
          return {
            displayValue: searchResult.dspaceObject.name,
            value: {name: searchResult.dspaceObject.name, id: searchResult.dspaceObject.uuid}
          };
        });
      })
    );

  }

  onClick(data: any): void {
    this.selectedCollection = data.name;
    this.selectedCollectionId = data.id;
  }

  /**
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  moveCollection() {
    this.itemDataService.moveToCollection(this.itemId, this.selectedCollectionId).first().subscribe(
      (response: RestResponse) => {
        this.router.navigate([getItemEditPath(this.itemId)]);
        if (response.isSuccessful) {
          this.notificationsService.success(this.translateService.get('item.move.success'));
        } else {
          this.notificationsService.error(this.translateService.get('item.move.error'));
        }
      }
    );

  }
}
