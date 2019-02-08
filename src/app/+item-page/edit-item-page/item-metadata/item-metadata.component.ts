import { Component, Inject, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import {
  FieldUpdate,
  FieldUpdates,
  Identifiable
} from '../../../core/data/object-updates/object-updates.reducer';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { first, switchMap } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-metadata',
  templateUrl: './item-metadata.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent implements OnInit {

  /**
   * The item to display the edit page for
   */
  @Input() item: Item;
  /**
   * The current values and updates for all this item's metadata fields
   */
  updates$: Observable<FieldUpdates>;
  /**
   * The current route of this page
   */
  route: string;
  /**
   * The time span for being able to undo discarding changes
   */
  private discardTimeOut: number;

  constructor(
    private itemService: ItemDataService,
    private objectUpdatesService: ObjectUpdatesService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig
  ) {

  }

  ngOnInit(): void {
    this.discardTimeOut = this.EnvConfig.notifications.timeOut;
    this.route = this.router.url;
    if (this.route.indexOf('?') > 0) {
      this.route = this.route.substr(0, this.route.indexOf('?'));
    }
    this.hasChanges().pipe(first()).subscribe((hasChanges) => {
      if (!hasChanges) {
        this.initializeOriginalFields();
      } else {
        this.checkLastModified();
      }
    });
    this.updates$ = this.objectUpdatesService.getFieldUpdates(this.route, this.item.metadata);
  }

  /**
   * Sends a new add update for a field to the object updates service
   * @param metadata The metadata to add, if no parameter is supplied, create a new Metadatum
   */
  add(metadata: Metadatum = new Metadatum()) {
    this.objectUpdatesService.saveAddFieldUpdate(this.route, metadata);
  }

  /**
   * Request the object updates service to discard all current changes to this item
   * Shows a notification to remind the user that they can undo this
   */
  discard() {
    const title = this.translateService.instant('item.edit.metadata.notifications.discarded.title');
    const content = this.translateService.instant('item.edit.metadata.notifications.discarded.content');
    const undoNotification = this.notificationsService.info(title, content, { timeOut: this.discardTimeOut });
    this.objectUpdatesService.discardFieldUpdates(this.route, undoNotification);
  }

  /**
   * Request the object updates service to undo discarding all changes to this item
   */
  reinstate() {
    this.objectUpdatesService.reinstateFieldUpdates(this.route);
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  private initializeOriginalFields() {
    this.objectUpdatesService.initialize(this.route, this.item.metadata, this.item.lastModified);
  }

  /* Prevent unnecessary rerendering so fields don't lose focus **/
  protected trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Requests all current metadata for this item and requests the item service to update the item
   * Makes sure the new version of the item is rendered on the page
   */
  submit() {
    const metadata$: Observable<Identifiable[]> = this.objectUpdatesService.getUpdatedFields(this.route, this.item.metadata) as Observable<Metadatum[]>;
    metadata$.pipe(
      first(),
      switchMap((metadata: Metadatum[]) => {
        const updatedItem: Item = Object.assign(cloneDeep(this.item), { metadata });
        return this.itemService.update(updatedItem);
      }),
      getSucceededRemoteData()
    ).subscribe(
      (rd: RemoteData<Item>) => {
        this.item = rd.payload;
        this.initializeOriginalFields();
        this.updates$ = this.objectUpdatesService.getFieldUpdates(this.route, this.item.metadata);
      }
    )
  }

  /**
   * Checks whether or not there are currently updates for this item
   */
  hasChanges(): Observable<boolean> {
    return this.objectUpdatesService.hasUpdates(this.route);
  }

  /**
   * Checks whether or not the item is currently reinstatable
   */
  isReinstatable(): Observable<boolean> {
    return this.objectUpdatesService.isReinstatable(this.route);
  }

  /**
   * Checks if the current item is still in sync with the version in the store
   * If it's not, a notification is shown and the changes are removed
   */
  private checkLastModified() {
    const currentVersion = this.item.lastModified;
    this.objectUpdatesService.getLastModified(this.route).pipe(first()).subscribe(
      (updateVersion: Date) => {
        if (updateVersion.getDate() !== currentVersion.getDate()) {
          const title = this.translateService.instant('item.edit.metadata.notifications.outdated.title');
          const content = this.translateService.instant('item.edit.metadata.notifications.outdated.content');
          this.notificationsService.warning(title, content);
          this.initializeOriginalFields();
        }
      }
    );
  }
}
