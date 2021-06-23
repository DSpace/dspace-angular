import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import {
  getAllSucceededRemoteDataPayload, getFirstCompletedRemoteData, getFirstSucceededRemoteData,
} from '../../../core/shared/operators';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Observable, of as observableOf } from 'rxjs';
import { Collection } from '../../../core/shared/collection.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { getItemEditRoute, getItemPageRoute } from '../../item-page-routing-paths';
import { followLink } from '../../../shared/utils/follow-link-config.model';

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

  selectorType = DSpaceObjectType.COLLECTION;

  inheritPolicies = false;
  itemRD$: Observable<RemoteData<Item>>;
  collectionSearchResults: Observable<any[]> = observableOf([]);
  selectedCollectionName: string;
  selectedCollection: Collection;
  canSubmit = false;

  item: Item;
  processing = false;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  COLLECTIONS = [DSpaceObjectType.COLLECTION];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService,
              private searchService: SearchService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.dso), getFirstSucceededRemoteData()) as Observable<RemoteData<Item>>;
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );
    this.itemRD$.subscribe((rd) => {
        this.item = rd.payload;
      }
    );
  }

  /**
   * Set the collection name and id based on the selected value
   * @param data - obtained from the ds-input-suggestions component
   */
  selectDso(data: any): void {
    this.selectedCollection = data;
    this.selectedCollectionName = data.name;
    this.canSubmit = true;
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
    this.processing = true;
    this.itemDataService.moveToCollection(this.item.id, this.selectedCollection)
                        .pipe(getFirstCompletedRemoteData())
                        .subscribe(
      (response: RemoteData<any>) => {
        this.itemDataService.findById(
          this.item.id, false, true, followLink('owningCollection', undefined, true, false)
        ).subscribe(() => {
          this.processing = false;
          this.router.navigate([getItemEditRoute(this.item)]);
        });
        if (response.hasSucceeded) {
          this.notificationsService.success(this.translateService.get('item.edit.move.success'));
        } else {
          this.notificationsService.error(this.translateService.get('item.edit.move.error'));
        }
      }
    );
  }
}
