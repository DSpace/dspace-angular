import { Inject, Injectable, OnInit } from '@angular/core';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { first, map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { AbstractTrackableComponent } from '../../../shared/trackable/abstract-trackable.component';

@Injectable()
/**
 * Abstract component for managing object updates of an item
 */
export abstract class AbstractItemUpdateComponent extends AbstractTrackableComponent implements OnInit {
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
    @Inject(GLOBAL_CONFIG) public EnvConfig: GlobalConfig,
    public route: ActivatedRoute
  ) {
    super(objectUpdatesService, notificationsService, translateService)
  }

  /**
   * Initialize common properties between item-update components
   */
  ngOnInit(): void {
    this.route.parent.data.pipe(map((data) => data.item))
      .pipe(
        first(),
        map((data: RemoteData<Item>) => data.payload)
      ).subscribe((item: Item) => {
      this.item = item;
    });

    this.discardTimeOut = this.EnvConfig.item.edit.undoTimeout;
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
   * Initialize the values and updates of the current item's fields
   */
  abstract initializeUpdates(): void;

  /**
   * Initialize the prefix for notification messages
   */
  abstract initializeNotificationsPrefix(): void;

  /**
   * Sends all initial values of this item to the object updates service
   */
  abstract initializeOriginalFields(): void;

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Check if the current page is entirely valid
   */
  protected isValid() {
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

  /**
   * Submit the current changes
   */
  abstract submit(): void;
}
