import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Item} from '../../../core/shared/item.model';
import {ItemDataService} from '../../../core/data/item-data.service';
import {ObjectUpdatesService} from '../../../core/data/object-updates/object-updates.service';
import {ActivatedRoute, Router} from '@angular/router';
import {cloneDeep} from 'lodash';
import {first, switchMap} from 'rxjs/operators';
import {getFirstCompletedRemoteData} from '../../../core/shared/operators';
import {RemoteData} from '../../../core/data/remote-data';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {MetadataValue, MetadatumViewModel} from '../../../core/shared/metadata.models';
import {AbstractItemUpdateComponent} from '../abstract-item-update/abstract-item-update.component';
import {UpdateDataService} from '../../../core/data/update-data.service';
import {hasNoValue, hasValue} from '../../../shared/empty.util';
import {AlertType} from '../../../shared/alert/aletr-type';
import {Operation} from 'fast-json-patch';
import {MetadataPatchOperationService} from '../../../core/data/object-updates/patch-operation-service/metadata-patch-operation.service';

import {ConfigurationDataService} from "../../../core/data/configuration-data.service";

@Component({
  selector: 'ds-item-metadata',
  styleUrls: ['./item-metadata.component.scss'],
  templateUrl: './item-metadata.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent extends AbstractItemUpdateComponent {
  securityConfigState={}
  securityLevelConfig: number = 0;
  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
  /**
   * A custom update service to use for adding and committing patches
   * This will default to the ItemDataService
   */
  @Input() updateService: UpdateDataService<Item>;

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public route: ActivatedRoute,
    private configurationDataService: ConfigurationDataService
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
  }

  /**
   * Set up and initialize all fields
   */
  async ngOnInit() {
    // this.findFallbackValuesOfSecurity();
    super.ngOnInit();
    if (hasNoValue(this.updateService)) {
      this.updateService = this.itemService;
    }
    this.findFallbackValuesOfSecurity().then(done => {
      this.item.metadataAsList.map(el => {
        this.configurationDataService.findByPropertyName("metadatavalue.visibility." + "Person." + el.key + ".settings").pipe(
          getFirstCompletedRemoteData(),
        ).subscribe(res1 => {
          if (res1.state == "Error") {
            el.securityConfigurationLevelLimit = this.securityLevelConfig;
            this.objectUpdatesService.saveChangeFieldUpdate(this.url, cloneDeep(el));
            this.securityConfigState[el.key] = this.securityLevelConfig
          } else {
            if (res1.state == "Success") {
              el.securityConfigurationLevelLimit = parseInt(res1.payload.values[0])
              this.objectUpdatesService.saveChangeFieldUpdate(this.url, cloneDeep(el));
            }
            this.securityConfigState[el.key] = parseInt(res1.payload.values[0])

          }
        })
      })
    })
  }

  /**
   * Initialize the values and updates of the current item's metadata fields
   */

  public initializeUpdates(): void {
    this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
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
    this.objectUpdatesService.initialize(this.url, this.item.metadataAsList, this.item.lastModified, MetadataPatchOperationService);
  }

  /**
   * Requests all current metadata for this item and requests the item service to update the item
   * Makes sure the new version of the item is rendered on the page
   */
  public submit() {
    this.isValid().pipe(first()).subscribe((isValid) => {
      if (isValid) {
        this.objectUpdatesService.createPatch(this.url).pipe(
          first(),
          switchMap((patch: Operation[]) => {
            return this.updateService.patch(this.item, patch).pipe(
              getFirstCompletedRemoteData()
            );
          })
        ).subscribe(
          (rd: RemoteData<Item>) => {
            if (rd.hasFailed) {
              this.notificationsService.error(this.getNotificationTitle('error'), rd.errorMessage);
            } else {
              this.item = rd.payload;
              this.checkAndFixMetadataUUIDs();
              this.initializeOriginalFields();
              let securityLevels =  this.item.metadataAsList.map(el => {
                el.securityConfigurationLevelLimit = this.securityConfigState[el.key];
                return el
              })
              this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, securityLevels);
              this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
            }
          }
        );
      } else {
        this.notificationsService.error(this.getNotificationTitle('invalid'), this.getNotificationContent('invalid'));
      }
    });
  }

  /**
   * Check for empty metadata UUIDs and fix them (empty UUIDs would break the object-update service)
   */
  checkAndFixMetadataUUIDs() {
    const metadata = cloneDeep(this.item.metadata);
    Object.keys(this.item.metadata).forEach((key: string) => {
      metadata[key] = this.item.metadata[key].map((value) => hasValue(value.uuid) ? value : Object.assign(new MetadataValue(), value));
    });
    this.item.metadata = metadata;
  }

  findFallbackValuesOfSecurity = () => new Promise(resolve => {
    // this.findMetadataSecurityConfigurationsForItem("metadatavalue.visibility." +  this.item.entityType + ".settings").subscribe(res => {
    this.configurationDataService.findByPropertyName("metadatavalue.visibility." + "Person" + ".settings").pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(res1 => {
      if (res1.state == "Error") {
        //default fallback lookup
        this.configurationDataService.findByPropertyName("metadatavalue.visibility.settings").pipe(
          getFirstCompletedRemoteData(),
        ).subscribe(res => {
          this.securityLevelConfig = parseInt(res.payload.values[0]);
          resolve()
        })
      } else {
        if (res1.state == "Success") {
          this.securityLevelConfig = parseInt(res1.payload.values[0]);
          resolve()
        }
      }
    })
  });

  addMetadata(suggestionControl) {
    this.configurationDataService.findByPropertyName("metadatavalue.visibility." + "Person." + suggestionControl.viewModel + ".settings").pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(res1 => {
      if (res1.state == "Error") {
        let found = false
        this.item.metadataAsList.forEach(el => {
          if (el.uuid === suggestionControl.valueAccessor.metadata.uuid) {
            found = true
            el.securityConfigurationLevelLimit = 0;
            el.key = suggestionControl.viewModel;
            this.objectUpdatesService.saveChangeFieldUpdate(this.url, el);
          }
        })
        if (!found) {
          suggestionControl.valueAccessor.metadata['securityConfigurationLevelLimit'] = 0;
          this.objectUpdatesService.saveChangeFieldUpdate(this.url, suggestionControl.valueAccessor.metadata);
        }
        this.securityConfigState[suggestionControl.valueAccessor.metadata.key] = 0;
      } else {
        if (res1.state == "Success") {
          let found = false
          this.item.metadataAsList.forEach(el => {
            if (el.uuid === suggestionControl.valueAccessor.metadata.uuid) {
              found = true
              el.securityConfigurationLevelLimit = parseInt(res1.payload.values[0]);
              el.key = suggestionControl.viewModel;
              this.objectUpdatesService.saveChangeFieldUpdate(this.url, el);
            }
          })
          if (!found) {
            suggestionControl.valueAccessor.metadata['securityConfigurationLevelLimit'] = parseInt(res1.payload.values[0]);
            this.objectUpdatesService.saveChangeFieldUpdate(this.url, suggestionControl.valueAccessor.metadata);
          }
          this.securityConfigState[suggestionControl.valueAccessor.metadata.key] = parseInt(res1.payload.values[0]);

        }
      }
    })
  }
}
