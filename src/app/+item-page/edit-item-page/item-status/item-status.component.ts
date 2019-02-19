import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';

@Component({
  selector: 'ds-item-status',
  templateUrl: './item-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(private router: Router, private route: ActivatedRoute) {
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
      if (item.isWithdrawn) {
        this.operations.push(new ItemOperation('reinstate', this.getCurrentUrl() + '/reinstate'));
      } else {
        this.operations.push(new ItemOperation('withdraw', this.getCurrentUrl() + '/withdraw'));
      }
      if (item.isDiscoverable) {
        this.operations.push(new ItemOperation('private', this.getCurrentUrl() + '/private'));
      } else {
        this.operations.push(new ItemOperation('public', this.getCurrentUrl() + '/public'));
      }
      this.operations.push(new ItemOperation('delete', this.getCurrentUrl() + '/delete'));
    });

  }

  /**
   * Get the url to the simple item page
   * @returns {string}  url
   */
  getItemPage(): string {
    return this.router.url.substr(0, this.router.url.lastIndexOf('/'));
  }

  /**
   * Get the current url without query params
   * @returns {string}  url
   */
  getCurrentUrl(): string {
    if (this.router.url.indexOf('?') > -1) {
      return this.router.url.substr(0, this.router.url.indexOf('?'));
    } else {
      return this.router.url;
    }
  }

}
