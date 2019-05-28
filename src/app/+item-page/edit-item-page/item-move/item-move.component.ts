import {Component, OnInit} from '@angular/core';
import {SearchService} from '../../../+search-page/search-service/search.service';
import {first, map} from 'rxjs/operators';
import {DSpaceObjectType} from '../../../core/shared/dspace-object-type.model';
import {SearchOptions} from '../../../+search-page/search-options.model';
import {RemoteData} from '../../../core/data/remote-data';
import {DSpaceObject} from '../../../core/shared/dspace-object.model';
import {PaginatedList} from '../../../core/data/paginated-list';
import {SearchResult} from '../../../+search-page/search-result.model';
import {Item} from '../../../core/shared/item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {getSucceededRemoteData} from '../../../core/shared/operators';
import {ItemDataService} from '../../../core/data/item-data.service';
import {getItemEditPath} from '../../item-page-routing.module';
import {Observable} from 'rxjs';
import {of as observableOf} from 'rxjs';
import { RestResponse } from '../../../core/cache/response.models';
import { Collection } from '../../../core/shared/collection.model';

@Component({
  selector: 'ds-item-move',
  templateUrl: './item-move.component.html'
})
/**
 * Component that handles the moving of an item to a different collection
 */
export class ItemMoveComponent implements OnInit {
  /**
   * TODO: There is currently no backend support to change the owningCollection and inherit policies,
   * TODO: when this is added, the inherit policies option should be used.
   */
  inheritPolicies = false;
  itemRD$: Observable<RemoteData<Item>>;
  collectionSearchResults: Observable<any[]> = observableOf([]);
  selectedCollection: string;
  selectedCollectionObject: Collection;

  itemId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService,
              private searchService: SearchService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item),getSucceededRemoteData()) as Observable<RemoteData<Item>>;
    this.itemRD$.subscribe((rd) => {
        this.itemId = rd.payload.id;
      }
    );
    this.loadSuggestions('');
  }

  /**
   * Find suggestions based on entered query
   * @param query - Search query
   */
  findSuggestions(query): void {
    this.loadSuggestions(query);
  }

  /**
   * Load all available collections to move the item to.
   *  TODO: When the API support it, only fetch collections where user has ADD rights to.
   */
  loadSuggestions(query): void {
    this.collectionSearchResults = this.searchService.search(new SearchOptions({
      dsoType: DSpaceObjectType.COLLECTION,
      query: query
    })).pipe(
      first(),
      map((rd: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
        return rd.payload.page.map((searchResult) => {
          return {
            displayValue: searchResult.indexableObject.name,
            value: {name: searchResult.indexableObject.name, object: searchResult.indexableObject}
          };
        });
      })
    );

  }

  /**
   * Set the collection name and id based on the selected value
   * @param data - obtained from the ds-input-suggestions component
   */
  onClick(data: any): void {
    this.selectedCollection = data.name;
    this.selectedCollectionObject = data.object;
  }

  /**
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  /**
   * Moves the item to a new collection based on the selected collection
   */
  moveCollection() {
    this.itemDataService.moveToCollection(this.itemId, this.selectedCollectionObject).pipe(first()).subscribe(
      (response: RestResponse) => {
        this.router.navigate([getItemEditPath(this.itemId)]);
        if (response.isSuccessful) {
          this.notificationsService.success(this.translateService.get('item.edit.move.success'));
        } else {
          this.notificationsService.error(this.translateService.get('item.edit.move.error'));
        }
      }
    );

  }
}
