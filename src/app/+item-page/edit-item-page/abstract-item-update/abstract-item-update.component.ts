import { Component, Injectable, OnInit } from '@angular/core';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { first, map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { AbstractTrackableComponent } from '../../../shared/trackable/abstract-trackable.component';
import { environment } from '../../../../environments/environment';
import { combineLatest as observableCombineLatest } from 'rxjs';

@Component({
  selector: 'ds-abstract-item-update',
  template: ''
})
/**
 * Abstract component for managing object updates of an item
 */
export class AbstractItemUpdateComponent extends AbstractTrackableComponent implements OnInit {
  /**
   * The item to display the edit page for
   */
  item: Item;
  /**
   * The current values and updates for all this item's fields
   * Should be initialized in the initializeUpdates method of the child component
   */
  updates$: Observable<FieldUpdates>;

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public route: ActivatedRoute
  ) {
    super(objectUpdatesService, notificationsService, translateService)
  }

  /**
   * Initialize common properties between item-update components
   */
  ngOnInit(): void {
    observableCombineLatest(this.route.data, this.route.parent.data).pipe(
      map(([data, parentData]) => Object.assign({}, data, parentData)),
      map((data) => data.item),
      first(),
      map((data: RemoteData<Item>) => data.payload)
    ).subscribe((item: Item) => {
      this.item = item;
      this.postItemInit();
    });

    this.discardTimeOut = environment.item.edit.undoTimeout;
    this.url = this.router.url;
    if (this.url.indexOf('?') > 0) {
      this.url = this.url.substr(0, this.url.indexOf('?'));
    }
    this.hasChanges().pipe(first()).subscribe((hasChanges) => {
      if (!hasChanges) {
        this.initializeOriginalFields();
      } else {
        this.checkLastModified();
      }
    });

    this.initializeNotificationsPrefix();
    this.initializeUpdates();
  }

  /**
   * Actions to perform after the item has been initialized
   * Abstract method: Should be overwritten in the sub class
   */
  postItemInit(): void {
    // Overwrite in subclasses
  }

  /**
   * Initialize the values and updates of the current item's fields
   * Abstract method: Should be overwritten in the sub class
   */
  initializeUpdates(): void {
    // Overwrite in subclasses
  }

  /**
   * Initialize the prefix for notification messages
   * Abstract method: Should be overwritten in the sub class
   */
  initializeNotificationsPrefix(): void {
    // Overwrite in subclasses
  }

  /**
   * Sends all initial values of this item to the object updates service
   * Abstract method: Should be overwritten in the sub class
   */
  initializeOriginalFields(): void {
    // Overwrite in subclasses
  }

  /**
   * Submit the current changes
   * Abstract method: Should be overwritten in the sub class
   */
  submit(): void {
    // Overwrite in subclasses
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Check if the current page is entirely valid
   */
  public isValid() {
    return this.objectUpdatesService.isValidPage(this.url);
  }

  /**
   * Checks if the current item is still in sync with the version in the store
   * If it's not, a notification is shown and the changes are removed
   */
  private checkLastModified() {
    const currentVersion = this.item.lastModified;
    this.objectUpdatesService.getLastModified(this.url).pipe(first()).subscribe(
      (updateVersion: Date) => {
        if (updateVersion.getDate() !== currentVersion.getDate()) {
          this.notificationsService.warning(this.getNotificationTitle('outdated'), this.getNotificationContent('outdated'));
          this.initializeOriginalFields();
        }
      }
    );
  }
}
