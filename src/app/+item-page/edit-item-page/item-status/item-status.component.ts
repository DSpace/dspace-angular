import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { getItemEditRoute, getItemPageRoute } from '../../item-page-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { hasValue } from '../../../shared/empty.util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

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
  operations$: BehaviorSubject<ItemOperation[]> = new BehaviorSubject<ItemOperation[]>([]);

  /**
   * The keys of the actions (to loop over)
   */
  actionsKeys;

  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationDataService) {
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
      const operations = [];
      operations.push(new ItemOperation('authorizations', this.getCurrentUrl(item) + '/authorizations'));
      operations.push(new ItemOperation('mappedCollections', this.getCurrentUrl(item) + '/mapper'));
      operations.push(undefined);
      // Store the index of the "withdraw" or "reinstate" operation, because it's added asynchronously
      const indexOfWithdrawReinstate = operations.length - 1;
      if (item.isDiscoverable) {
        operations.push(new ItemOperation('private', this.getCurrentUrl(item) + '/private'));
      } else {
        operations.push(new ItemOperation('public', this.getCurrentUrl(item) + '/public'));
      }
      operations.push(new ItemOperation('delete', this.getCurrentUrl(item) + '/delete'));
      operations.push(new ItemOperation('move', this.getCurrentUrl(item) + '/move'));

      this.operations$.next(operations);

      if (item.isWithdrawn) {
        this.authorizationService.isAuthorized(FeatureID.ReinstateItem, item.self).pipe(distinctUntilChanged()).subscribe((authorized) => {
          const newOperations = [...this.operations$.value];
          if (authorized) {
            newOperations[indexOfWithdrawReinstate] = new ItemOperation('reinstate', this.getCurrentUrl(item) + '/reinstate');
          } else {
            newOperations[indexOfWithdrawReinstate] = undefined;
          }
          this.operations$.next(newOperations);
        });
      } else {
        this.authorizationService.isAuthorized(FeatureID.WithdrawItem, item.self).pipe(distinctUntilChanged()).subscribe((authorized) => {
          const newOperations = [...this.operations$.value];
          if (authorized) {
            newOperations[indexOfWithdrawReinstate] = new ItemOperation('withdraw', this.getCurrentUrl(item) + '/withdraw');
          } else {
            newOperations[indexOfWithdrawReinstate] = undefined;
          }
          this.operations$.next(newOperations);
        });
      }
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
    return getItemEditRoute(item.id);
  }

  trackOperation(index: number, operation: ItemOperation) {
    return hasValue(operation) ? operation.operationKey : undefined;
  }

}
