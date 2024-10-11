import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractTrackableComponent } from '../../../shared/trackable/abstract-trackable.component';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel,
  DynamicOptionControlModel,
  DynamicRadioGroupModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { UntypedFormGroup } from '@angular/forms';
import { hasNoValue, hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ContentSource, ContentSourceHarvestType } from '../../../core/shared/content-source.model';
import { Observable, Subscription, throwError } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { MetadataConfig } from '../../../core/shared/metadata-config.model';
import { INotification } from '../../../shared/notifications/models/notification.model';
import { RequestService } from '../../../core/data/request.service';
import { environment } from '../../../../environments/environment';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { Operation } from 'fast-json-patch';

/**
 * Component for managing the content source of the collection
 */
@Component({
  selector: 'ds-collection-source',
  templateUrl: './collection-source.component.html',
})
export class CollectionSourceComponent extends AbstractTrackableComponent implements OnInit, OnDestroy {
  /**
   * The current collection's remote data
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  /**
   * The collection's content source
   */
  contentSource: ContentSource;

  /**
   * The current update to the content source
   */
  update$: Observable<FieldUpdate>;

  /**
   * The initial harvest type we started off with
   * Used to compare changes
   */
  initialHarvestType: ContentSourceHarvestType;

  /**
   * @type {string} Key prefix used to generate form labels
   */
  LABEL_KEY_PREFIX = 'collection.edit.tabs.source.form.';

  /**
   * @type {string} Key prefix used to generate form error messages
   */
  ERROR_KEY_PREFIX = 'collection.edit.tabs.source.form.errors.';

  /**
   * @type {string} Key prefix used to generate form option labels
   */
  OPTIONS_KEY_PREFIX = 'collection.edit.tabs.source.form.options.';

  /**
   * The Dynamic Input Model for the OAI Provider
   */
  oaiSourceModel = new DynamicInputModel({
    id: 'oaiSource',
    name: 'oaiSource',
    required: true,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'You must provide a set id of the target collection.'
    }
  });

  /**
   * The Dynamic Input Model for the OAI Set
   */
  oaiSetIdModel = new DynamicInputModel({
    id: 'oaiSetId',
    name: 'oaiSetId'
  });

  /**
   * The Dynamic Input Model for the Metadata Format used
   */
  metadataConfigIdModel = new DynamicSelectModel({
    id: 'metadataConfigId',
    name: 'metadataConfigId'
  });

  /**
   * The Dynamic Input Model for enable/disable record validation
   */
  recordValidationEnabledModel = new DynamicCheckboxModel({
    id: 'recordValidationEnabled',
    name: 'recordValidationEnabled'
  });

  /**
   * The Dynamic Input Model for enable/disable item validation
   */
  itemValidationEnabledModel = new DynamicCheckboxModel({
    id: 'itemValidationEnabled',
    name: 'itemValidationEnabled'
  });

  /**
   * The Dynamic Input Model to force or not synchronization
   */
  forceSynchronizationModel = new DynamicCheckboxModel({
    id: 'forceSynchronization',
    name: 'forceSynchronization'
  });

  /**
   * The Dynamic Input Model for the Admin email
   */
  adminEmailModel = new DynamicInputModel({
    id: 'adminEmail',
    name: 'adminEmail',
    required: false
  });

  ccAddressesModel = new DynamicInputModel({
    id: 'ccAddresses',
    name: 'ccAddresses',
    required: false
  });

  /**
   * The Dynamic Input Model for the pre transformation
   */
  preTransformModel = new DynamicInputModel({
    id: 'preTransform',
    name: 'preTransform',
    required: false
  });

  /**
   * The Dynamic Input Model for the post transformation
   */
  postTransformModel = new DynamicInputModel({
    id: 'postTransform',
    name: 'postTransform',
    required: false
  });

  /**
   * The Dynamic Input Model for the type of harvesting
   */
  harvestTypeModel = new DynamicRadioGroupModel<string>({
    id: 'harvestType',
    name: 'harvestType',
    options: [
      {
        value: ContentSourceHarvestType.Metadata
      },
      {
        value: ContentSourceHarvestType.MetadataAndRef
      },
      {
        value: ContentSourceHarvestType.MetadataAndBitstreams
      }
    ]
  });

  /**
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.oaiSourceModel, this.oaiSetIdModel, this.metadataConfigIdModel, this.recordValidationEnabledModel, this.itemValidationEnabledModel,
    this.forceSynchronizationModel, this.harvestTypeModel, this.adminEmailModel, this.ccAddressesModel, this.preTransformModel, this.postTransformModel];

  /**
   * The dynamic form fields used for editing the content source of a collection
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'oaiSourceContainer',
      group: [
        this.oaiSourceModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'oaiSetContainer',
      group: [
        this.oaiSetIdModel,
        this.metadataConfigIdModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'validationContainer',
      group: [
        this.recordValidationEnabledModel,
        this.itemValidationEnabledModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'forceSynchronizationContainer',
      group: [
        this.forceSynchronizationModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'adminEmailContainer',
      group: [
        this.adminEmailModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'ccAddressesContainer',
      group: [
        this.ccAddressesModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'transformContainer',
      group: [
        this.preTransformModel,
        this.postTransformModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'harvestTypeContainer',
      group: [
        this.harvestTypeModel
      ]
    })
  ];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    oaiSource: {
      grid: {
        host: 'col-12 d-inline-block mb-3'
      }
    },
    oaiSetId: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    metadataConfigId: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    recordValidationEnabled: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    itemValidationEnabled: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    forceSynchronization: {
      grid: {
        host: 'col-12 mb-3',
      }
    },
    harvestType: {
      grid: {
        host: 'col-12 mb-3',
        option: 'btn-outline-secondary'
      }
    },
    adminEmail: {
      grid: {
        host: 'col-12 mb-3',
      }
    },
    ccAddresses: {
      grid: {
        host: 'col-12 mb-3',
      }
    },
    preTransform: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    postTransform: {
      grid: {
        host: 'col col-sm-6 d-inline-block mb-3'
      }
    },
    oaiSetContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    oaiSourceContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    harvestTypeContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    forceSynchronizationContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    adminEmailContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    ccAddressesContainer: {
      grid: {
        host: 'row mt-2'
      }
    },
    transformContainer: {
      grid: {
        host: 'row mt-2'
      }
    }
  };

  /**
   * The form group of this form
   */
  formGroup: UntypedFormGroup;

  /**
   * The content harvesting type used when harvesting is disabled
   */
  harvestTypeNone = ContentSourceHarvestType.None;

  /**
   * The previously selected harvesting type
   * Used for switching between ContentSourceHarvestType.None and the previously selected value when enabling / disabling harvesting
   * Defaults to ContentSourceHarvestType.Metadata
   */
  previouslySelectedHarvestType = ContentSourceHarvestType.Metadata;

  /**
   * Notifications displayed after clicking submit
   * These are cleaned up every time a user submits the form to prevent error or other notifications from staying active
   * while they shouldn't be.
   */
  displayedNotifications: INotification[] = [];

  subs: Subscription[] = [];

  public constructor(
    public objectUpdatesService: ObjectUpdatesService,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public router: Router,
    protected location: Location,
    protected formService: DynamicFormService,
    protected route: ActivatedRoute,
    protected collectionService: CollectionDataService,
    protected requestService: RequestService,
  ) {
    super(objectUpdatesService, notificationsService, translateService, router);
  }

  /**
   * Initialize properties to setup the Field Update and Form
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.notificationsPrefix = 'collection.edit.tabs.source.notifications.';
    this.discardTimeOut = environment.collection.edit.undoTimeout;
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.dso));

    this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      map((col) => col.payload),
      tap((col) => this.initializeEmailAndTransform(col)),
      map((col) => col.uuid),
      switchMap((uuid) => this.collectionService.getContentSource(uuid)),
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<ContentSource>) => {
      this.initializeOriginalContentSource(rd.payload);
    });

    this.updateFieldTranslations();
    this.subs.push(this.translateService.onLangChange.subscribe(() => {
      this.updateFieldTranslations();
    }));
  }

  initializeEmailAndTransform(collection: Collection) {

    const adminAddress = collection ? collection.firstMetadataValue('cris.harvesting.email') : '';
    const preTransform = collection ? collection.firstMetadataValue('cris.harvesting.preTransform') : '';
    const postTransform = collection ? collection.firstMetadataValue('cris.harvesting.postTransform') : '';
    const forceSynchronization = collection ? collection.firstMetadataValue('cris.harvesting.forceSynchronization') === 'true' : false;
    const itemValidationEnabled = collection ? collection.firstMetadataValue('cris.harvesting.itemValidationEnabled') === 'true' : false;
    const recordValidationEnabled = collection ? collection.firstMetadataValue('cris.harvesting.recordValidationEnabled') === 'true' : false;
    const ccAddresses = collection ? collection.allMetadataValues('cris.harvesting.ccAddress').join(', ') : '';

    this.adminEmailModel.value = adminAddress;
    this.preTransformModel.value = preTransform;
    this.postTransformModel.value = postTransform;
    this.forceSynchronizationModel.value = forceSynchronization;
    this.itemValidationEnabledModel.value = itemValidationEnabled;
    this.recordValidationEnabledModel.value = recordValidationEnabled;
    this.ccAddressesModel.value = ccAddresses;

    this.formGroup.patchValue({
      adminEmailContainer: {
        adminEmail: adminAddress,
      },
      forceSynchronizationContainer: {
        forceSynchronization : forceSynchronization
      },
      ccAddressesContainer: {
        ccAddresses : ccAddresses
      },
      validationContainer: {
        itemValidationEnabled: itemValidationEnabled,
        recordValidationEnabled: recordValidationEnabled
      },
      transformContainer: {
        preTransform: preTransform,
        postTransform: postTransform
      }
    });
  }

  /**
   * Initialize the Field Update and subscribe on it to fire updates to the form whenever it changes
   */
  initializeOriginalContentSource(contentSource: ContentSource) {
    this.contentSource = contentSource;
    this.initialHarvestType = contentSource.harvestType;
    this.initializeMetadataConfigs();
    const initialContentSource = cloneDeep(this.contentSource);
    this.objectUpdatesService.initialize(this.url, [initialContentSource], new Date());
    this.update$ = this.objectUpdatesService.getFieldUpdates(this.url, [initialContentSource]).pipe(
      map((updates: FieldUpdates) => updates[initialContentSource.uuid])
    );
    this.subs.push(this.update$.subscribe((update: FieldUpdate) => {
      if (update) {
        const field = update.field as ContentSource;
        let configId;
        if (hasValue(this.contentSource) && isNotEmpty(this.contentSource.metadataConfigs)) {
          configId = this.contentSource.metadataConfigs[0].id;
        }
        if (hasValue(field) && hasValue(field.metadataConfigId)) {
          configId = field.metadataConfigId;
        }
        if (hasValue(field)) {
          this.formGroup.patchValue({
            oaiSourceContainer: {
              oaiSource: field.oaiSource
            },
            oaiSetContainer: {
              oaiSetId: field.oaiSetId,
              metadataConfigId: configId
            },
            harvestTypeContainer: {
              harvestType: field.harvestType
            }
          });
          this.contentSource = cloneDeep(field);
        }
        this.contentSource.metadataConfigId = configId;
      }
    }));
  }

  /**
   * Fill the metadataConfigIdModel's options using the contentSource's metadataConfigs property
   */
  initializeMetadataConfigs() {
    this.metadataConfigIdModel.options = this.contentSource.metadataConfigs
      .map((metadataConfig: MetadataConfig) => Object.assign({ value: metadataConfig.id, label: metadataConfig.label }));
    if (this.metadataConfigIdModel.options.length > 0) {
      this.formGroup.patchValue({
        oaiSetContainer: {
          metadataConfigId: this.metadataConfigIdModel.options[0].value
        }
      });
    }
  }

  /**
   * Used the update translations of errors and labels on init and on language change
   */
  private updateFieldTranslations() {
    this.inputModels.forEach(
      (fieldModel: DynamicFormControlModel) => {
        this.updateFieldTranslation(fieldModel);
      }
    );
  }

  /**
   * Update the translations of a DynamicInputModel
   * @param fieldModel
   */
  private updateFieldTranslation(fieldModel: DynamicFormControlModel) {
    fieldModel.label = this.translateService.instant(this.LABEL_KEY_PREFIX + fieldModel.id);
    if (isNotEmpty(fieldModel.validators)) {
      fieldModel.errorMessages = {};
      Object.keys(fieldModel.validators).forEach((key) => {
        fieldModel.errorMessages[key] = this.translateService.instant(this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
      });
    }
    if (fieldModel instanceof DynamicOptionControlModel) {
      if (isNotEmpty(fieldModel.options)) {
        fieldModel.options.forEach((option) => {
          if (hasNoValue(option.label)) {
            option.label = this.translateService.instant(this.OPTIONS_KEY_PREFIX + fieldModel.id + '.' + option.value);
          }
        });
      }
    }
  }

  /**
   * Fired whenever the form receives an update and makes sure the Content Source and field update is up-to-date with the changes
   * @param event
   */
  onChange(event) {
    this.updateContentSourceField(event.model, true);
    this.saveFieldUpdate();
  }

  /**
   * Submit the edited Content Source to the REST API, re-initialize the field update and display a notification
   */
  onSubmit() {
    // Remove cached harvester request to allow for latest harvester to be displayed when switching tabs
    this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      map((col) => col.payload.uuid),
      switchMap((uuid) => this.collectionService.getHarvesterEndpoint(uuid)),
      take(1)
    ).subscribe((endpoint) => this.requestService.removeByHrefSubstring(endpoint));
    this.requestService.setStaleByHrefSubstring(this.contentSource._links.self.href);
    // Update harvester
    this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      switchMap((coll) => this.updateCollection(coll.payload) as Observable<string>),
      take(1),
      switchMap((uuid) => this.collectionService.updateContentSource(uuid, this.contentSource)),
      take(1)
    ).subscribe((result: ContentSource | INotification) => {
      if (hasValue((result as any).harvestType)) {
        this.clearNotifications();
        this.initializeOriginalContentSource(result as ContentSource);
        this.displayedNotifications.push(this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved')));
      } else {
        this.displayedNotifications.push(result as INotification);
      }
    });
  }

  updateCollection(collection: Collection): Observable<string|Observable<never>> {

    const operations: Operation[] = [];
    this.addOperation(operations, this.adminEmailModel, 'cris.harvesting.email', collection);
    this.addOperation(operations, this.preTransformModel, 'cris.harvesting.preTransform', collection);
    this.addOperation(operations, this.postTransformModel, 'cris.harvesting.postTransform', collection);
    this.addOperation(operations, this.itemValidationEnabledModel, 'cris.harvesting.itemValidationEnabled', collection);
    this.addOperation(operations, this.recordValidationEnabledModel, 'cris.harvesting.recordValidationEnabled', collection);
    this.addOperation(operations, this.forceSynchronizationModel, 'cris.harvesting.forceSynchronization', collection);

    operations.push({
      op: 'remove',
      path: '/metadata/cris.harvesting.ccAddress'
    });

    if (this.ccAddressesModel.value) {
      this.ccAddressesModel.value.toString().split(',')
        .map((address) => address.trim())
        .forEach((address) =>  operations.push({
          op: 'add',
          value: address,
          path: '/metadata/cris.harvesting.ccAddress'
        }));
    }

    return this.collectionService.patch(collection, operations).pipe(
      getFirstCompletedRemoteData(),
      map((response) => {
        if (!response.isSuccess) {
          return throwError('The collection update fails');
        }
        return collection.uuid;
      }));
  }

  addOperation(operations: Operation[], inputModel: any, metadata: string, collection: Collection) {
    const value = inputModel.value;
    if (value) {
      operations.push({
        op: 'replace',
        value: value + '',
        path: '/metadata/' + metadata
      });
    } else if (collection.hasMetadata(metadata)) {
      operations.push({
        op: 'remove',
        path: '/metadata/' + metadata
      });
    }
  }

  /**
   * Cancel the edit and return to the previous page
   */
  onCancel() {
    this.location.back();
  }

  /**
   * Is the current form valid to be submitted ?
   */
  isValid(): boolean {
    return (this.contentSource.harvestType === ContentSourceHarvestType.None) || this.formGroup.valid;
  }

  /**
   * Switch the external source on or off and fire a field update
   */
  changeExternalSource() {
    if (this.contentSource.harvestType === ContentSourceHarvestType.None) {
      this.contentSource.harvestType = this.previouslySelectedHarvestType;
    } else {
      this.previouslySelectedHarvestType = this.contentSource.harvestType;
      this.contentSource.harvestType = ContentSourceHarvestType.None;
    }
    this.updateContentSource(false);
  }

  /**
   * Loop over all inputs and update the Content Source with their value
   * @param updateHarvestType   When set to false, the harvestType of the contentSource will be ignored in the update
   */
  updateContentSource(updateHarvestType: boolean) {
    this.inputModels.forEach(
      (fieldModel: DynamicInputModel) => {
        this.updateContentSourceField(fieldModel, updateHarvestType);
      }
    );
    this.saveFieldUpdate();
  }

  /**
   * Update the Content Source with the value from a DynamicInputModel
   * @param fieldModel          The fieldModel to fetch the value from and update the contentSource with
   * @param updateHarvestType   When set to false, the harvestType of the contentSource will be ignored in the update
   */
  updateContentSourceField(fieldModel: DynamicInputModel, updateHarvestType: boolean) {
    if (hasValue(fieldModel.value) && !(fieldModel.id === this.harvestTypeModel.id && !updateHarvestType)) {
      this.contentSource[fieldModel.id] = fieldModel.value;
    }
  }

  /**
   * Save the current Content Source to the Object Updates cache
   */
  saveFieldUpdate() {
    this.objectUpdatesService.saveAddFieldUpdate(this.url, cloneDeep(this.contentSource));
  }

  /**
   * Clear possible active notifications
   */
  clearNotifications() {
    this.displayedNotifications.forEach((notification: INotification) => {
      this.notificationsService.remove(notification);
    });
    this.displayedNotifications = [];
  }

  /**
   * Make sure open subscriptions are closed
   */
  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
