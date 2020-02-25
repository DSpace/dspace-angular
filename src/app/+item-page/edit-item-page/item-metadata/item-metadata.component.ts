import { Component, Inject } from '@angular/core';
import { LinkService } from '../../../core/cache/builders/link.service';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import {
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
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { MetadataField } from '../../../core/metadata/metadata-field.model';

@Component({
  selector: 'ds-item-metadata',
  styleUrls: ['./item-metadata.component.scss'],
  templateUrl: './item-metadata.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent extends AbstractItemUpdateComponent {

  /**
   * Observable with a list of strings with all existing metadata field keys
   */
  metadataFields$: Observable<string[]>;

  constructor(
    protected itemService: ItemDataService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected route: ActivatedRoute,
    protected metadataFieldService: RegistryService,
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.metadataFields$ = this.findMetadataFields();
  }

  /**
   * Initialize the values and updates of the current item's metadata fields
   */
  public initializeUpdates(): void {
    this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.getMetadataAsListExcludingRelationships());
  }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.metadata.notifications.';
  }

  /**
   * Sends a new add update for a field to the object updates service
   * @param metadata The metadata to add, if no parameter is supplied, create a new Metadatum
   */
  add(metadata: MetadatumViewModel = new MetadatumViewModel()) {
    this.objectUpdatesService.saveAddFieldUpdate(this.url, metadata);
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    this.objectUpdatesService.initialize(this.url, this.getMetadataAsListExcludingRelationships(), this.item.lastModified);
  }

  /**
   * Requests all current metadata for this item and requests the item service to update the item
   * Makes sure the new version of the item is rendered on the page
   */
  public submit() {
    this.isValid().pipe(first()).subscribe((isValid) => {
      if (isValid) {
        const metadata$: Observable<Identifiable[]> = this.objectUpdatesService.getUpdatedFields(this.url, this.getMetadataAsListExcludingRelationships()) as Observable<MetadatumViewModel[]>;
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
            this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.getMetadataAsListExcludingRelationships());
            this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
          }
        )
      } else {
        this.notificationsService.error(this.getNotificationTitle('invalid'), this.getNotificationContent('invalid'));
      }
    });
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

  getMetadataAsListExcludingRelationships(): MetadatumViewModel[] {
    return this.item.metadataAsList.filter((metadata: MetadatumViewModel) => !metadata.key.startsWith('relation.') && !metadata.key.startsWith('relationship.'));
  }
}
