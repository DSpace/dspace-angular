import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { getItemEditPath, getItemPageRoute } from '../../item-page-routing.module';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-item-status',
  templateUrl: './item-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component for displaying an item's status
 */
export class ItemStatusComponent implements OnInit {

  /**
   * The item to display the status for
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The data to show in the status
   */
  statusData: any;
  /**
   * The keys of the data (to loop over)
   */
  statusDataKeys;

  /**
   * The possible actions that can be performed on the item
   *  key: id   value: url to action's component
   */
  operations: ItemOperation[];

  /**
   * The keys of the actions (to loop over)
   */
  actionsKeys;

  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationDataService,
              private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.data.pipe(map((data) => data.item));
    this.itemRD$.pipe(
      first(),
      map((data: RemoteData<Item>) => data.payload)
    ).subscribe((item: Item) => {
      this.statusData = Object.assign({
        id: item.id,
        handle: item.handle,
        lastModified: item.lastModified
      });
      this.statusDataKeys = Object.keys(this.statusData);
      /*
        The key is used to build messages
          i18n example: 'item.edit.tabs.status.buttons.<key>.label'
        The value is supposed to be a href for the button
      */
      this.operations = [];
      this.operations.push(new ItemOperation('authorizations', this.getCurrentUrl(item) + '/authorizations'));
      this.operations.push(new ItemOperation('mappedCollections', this.getCurrentUrl(item) + '/mapper'));
      this.operations.push(undefined);
      // Store the index of the "withdraw" or "reinstate" operation, because it's added asynchronously
      const index = this.operations.length - 1;
      if (item.isWithdrawn) {
        this.authorizationService.isAuthorized(FeatureID.ReinstateItem, item.self).pipe(distinctUntilChanged()).subscribe((authorized) => {
          if (authorized) {
            console.log('added reinstate');
            this.operations[index] = new ItemOperation('reinstate', this.getCurrentUrl(item) + '/reinstate');
          } else {
            this.operations[index] = undefined;
          }
          this.changeDetection.detectChanges();
        });
      } else {
        this.authorizationService.isAuthorized(FeatureID.WithdrawItem, item.self).pipe(distinctUntilChanged()).subscribe((authorized) => {
          if (authorized) {
            console.log('added withdraw');
            this.operations[index] = new ItemOperation('withdraw', this.getCurrentUrl(item) + '/withdraw');
          } else {
            this.operations[index] = undefined;
          }
          this.changeDetection.detectChanges();
        });
      }
      if (item.isDiscoverable) {
        this.operations.push(new ItemOperation('private', this.getCurrentUrl(item) + '/private'));
      } else {
        this.operations.push(new ItemOperation('public', this.getCurrentUrl(item) + '/public'));
      }
      this.operations.push(new ItemOperation('delete', this.getCurrentUrl(item) + '/delete'));
      this.operations.push(new ItemOperation('move', this.getCurrentUrl(item) + '/move'));
    });

  }

  /**
   * Get the url to the simple item page
   * @returns {string}  url
   */
  getItemPage(item: Item): string {
    return getItemPageRoute(item.id)
  }

  /**
   * Get the current url without query params
   * @returns {string}  url
   */
  getCurrentUrl(item: Item): string {
    return getItemEditPath(item.id);
  }

  trackOperation(index: number, operation: ItemOperation) {
    return hasValue(operation) ? operation.operationKey : undefined;
  }

}
