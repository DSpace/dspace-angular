import { Component, Inject, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import {
  FieldUpdate,
  FieldUpdates,
  Identifiable
} from '../../../core/data/object-updates/object-updates.reducer';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { TranslateService } from '@ngx-translate/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { MetadatumViewModel } from '../../../core/shared/metadata.models';
import { Metadata } from '../../../core/shared/metadata.utils';
import { MetadataField } from '../../../core/metadata/metadata-field.model';

@Component({
  selector: 'ds-item-metadata',
  styleUrls: ['./item-metadata.component.scss'],
  templateUrl: './item-metadata.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent implements OnInit {

  /**
   * The item to display the edit page for
   */
  item: Item;
  /**
   * The current values and updates for all this item's metadata fields
   */
  updates$: Observable<FieldUpdates>;
  /**
   * The current url of this page
   */
  url: string;
  /**
   * The time span for being able to undo discarding changes
   */
  private discardTimeOut: number;
  /**
   * Prefix for this component's notification translate keys
   */
  private notificationsPrefix = 'item.edit.metadata.notifications.';

  /**
   * Observable with a list of strings with all existing metadata field keys
   */
  metadataFields$: Observable<string[]>;

  constructor(
    private itemService: ItemDataService,
    private objectUpdatesService: ObjectUpdatesService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    private route: ActivatedRoute,
    private metadataFieldService: RegistryService,
  ) {

  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    this.metadataFields$ = this.findMetadataFields();
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
    this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
  }

  /**
   * Sends a new add update for a field to the object updates service
   * @param metadata The metadata to add, if no parameter is supplied, create a new Metadatum
   */
  add(metadata: MetadatumViewModel = new MetadatumViewModel()) {
    this.objectUpdatesService.saveAddFieldUpdate(this.url, metadata);

  }

  /**
   * Request the object updates service to discard all current changes to this item
   * Shows a notification to remind the user that they can undo this
   */
  discard() {
    const undoNotification = this.notificationsService.info(this.getNotificationTitle('discarded'), this.getNotificationContent('discarded'), { timeOut: this.discardTimeOut });
    this.objectUpdatesService.discardFieldUpdates(this.url, undoNotification);
  }

  /**
   * Request the object updates service to undo discarding all changes to this item
   */
  reinstate() {
    this.objectUpdatesService.reinstateFieldUpdates(this.url);
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  private initializeOriginalFields() {
    this.objectUpdatesService.initialize(this.url, this.item.metadataAsList, this.item.lastModified);
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Requests all current metadata for this item and requests the item service to update the item
   * Makes sure the new version of the item is rendered on the page
   */
  submit() {
    this.isValid().pipe(first()).subscribe((isValid) => {
      if (isValid) {
        const metadata$: Observable<Identifiable[]> = this.objectUpdatesService.getUpdatedFields(this.url, this.item.metadataAsList) as Observable<MetadatumViewModel[]>;
        metadata$.pipe(
          first(),
          switchMap((metadata: MetadatumViewModel[]) => {
            const updatedItem: Item = Object.assign(cloneDeep(this.item), { metadata: Metadata.toMetadataMap(metadata) });
            return this.itemService.update(updatedItem);
          }),
          tap(() => this.itemService.commitUpdates()),
          getSucceededRemoteData()
        ).subscribe(
          (rd: RemoteData<Item>) => {
            this.item = rd.payload;
            this.initializeOriginalFields();
            this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
            this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
          }
        )
      } else {
        this.notificationsService.error(this.getNotificationTitle('invalid'), this.getNotificationContent('invalid'));
      }
    });
  }

  /**
   * Checks whether or not there are currently updates for this item
   */
  hasChanges(): Observable<boolean> {
    return this.objectUpdatesService.hasUpdates(this.url);
  }

  /**
   * Checks whether or not the item is currently reinstatable
   */
  isReinstatable(): Observable<boolean> {
    return this.objectUpdatesService.isReinstatable(this.url);
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
   * Check if the current page is entirely valid
   */
  private isValid() {
    return this.objectUpdatesService.isValidPage(this.url);
  }

  /**
   * Get translated notification title
   * @param key
   */
  private getNotificationTitle(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.title');
  }

  /**
   * Get translated notification content
   * @param key
   */
  private getNotificationContent(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.content');

  }

  /**
   * Method to request all metadata fields and convert them to a list of strings
   */
  findMetadataFields(): Observable<string[]> {
    return this.metadataFieldService.getAllMetadataFields().pipe(
      getSucceededRemoteData(),
      take(1),
      map((remoteData$) => remoteData$.payload.page.map((field: MetadataField) => field.toString())));
  }
}
