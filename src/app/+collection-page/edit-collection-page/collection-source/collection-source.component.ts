import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractTrackableComponent } from '../../../shared/trackable/abstract-trackable.component';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel,
  DynamicOptionControlModel,
  DynamicRadioGroupModel,
  DynamicSelectModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FormGroup } from '@angular/forms';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ContentSource, ContentSourceHarvestType } from '../../../core/shared/content-source.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { first, map, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Subscription } from 'rxjs/internal/Subscription';
import { cloneDeep } from 'lodash';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { getSucceededRemoteData } from '../../../core/shared/operators';

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
    name: 'metadataConfigId',
    options: [
      {
        value: 'dc'
      },
      {
        value: 'qdc'
      },
      {
        value: 'dim'
      }
    ],
    value: 'dc'
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
  inputModels = [this.oaiSourceModel, this.oaiSetIdModel, this.metadataConfigIdModel, this.harvestTypeModel];

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
        host: 'col-12 d-inline-block'
      }
    },
    oaiSetId: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    metadataConfigId: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    harvestType: {
      grid: {
        host: 'col-12',
        option: 'btn-outline-secondary'
      }
    },
    oaiSetContainer: {
      grid: {
        host: 'row'
      }
    },
    oaiSourceContainer: {
      grid: {
        host: 'row'
      }
    },
    harvestTypeContainer: {
      grid: {
        host: 'row'
      }
    }
  };

  /**
   * The form group of this form
   */
  formGroup: FormGroup;

  /**
   * Subscription to update the current form
   */
  updateSub: Subscription;

  harvestTypeNone = ContentSourceHarvestType.None;

  public constructor(public objectUpdatesService: ObjectUpdatesService,
                     public notificationsService: NotificationsService,
                     protected location: Location,
                     protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected route: ActivatedRoute,
                     protected router: Router,
                     @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
                     protected collectionService: CollectionDataService) {
    super(objectUpdatesService, notificationsService, translate);
  }

  /**
   * Initialize properties to setup the Field Update and Form
   */
  ngOnInit(): void {
    this.notificationsPrefix = 'collection.edit.tabs.source.notifications.';
    this.discardTimeOut = this.EnvConfig.collection.edit.undoTimeout;
    this.url = this.router.url;
    if (this.url.indexOf('?') > 0) {
      this.url = this.url.substr(0, this.url.indexOf('?'));
    }
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.dso));

    this.collectionRD$.pipe(
      getSucceededRemoteData(),
      map((col) => col.payload.uuid),
      switchMap((uuid) => this.collectionService.getContentSource(uuid)),
      take(1)
    ).subscribe((contentSource: ContentSource) => {
      this.contentSource = contentSource;
      this.initializeOriginalContentSource();
    });

    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
  }

  /**
   * Initialize the Field Update and subscribe on it to fire updates to the form whenever it changes
   */
  initializeOriginalContentSource() {
    const initialContentSource = cloneDeep(this.contentSource);
    this.objectUpdatesService.initialize(this.url, [initialContentSource], new Date());
    this.update$ = this.objectUpdatesService.getFieldUpdates(this.url, [initialContentSource]).pipe(
      map((updates: FieldUpdates) => updates[initialContentSource.uuid])
    );
    this.updateSub = this.update$.subscribe((update: FieldUpdate) => {
      if (update) {
        const field = update.field as ContentSource;
        this.formGroup.patchValue({
          oaiSourceContainer: {
            oaiSource: field.oaiSource
          },
          oaiSetContainer: {
            oaiSetId: field.oaiSetId,
            metadataConfigId: field.metadataConfigId
          },
          harvestTypeContainer: {
            harvestType: field.harvestType
          }
        });
        this.contentSource = cloneDeep(field);
      }
    });
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
    fieldModel.label = this.translate.instant(this.LABEL_KEY_PREFIX + fieldModel.id);
    if (isNotEmpty(fieldModel.validators)) {
      fieldModel.errorMessages = {};
      Object.keys(fieldModel.validators).forEach((key) => {
        fieldModel.errorMessages[key] = this.translate.instant(this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
      });
    }
    if (fieldModel instanceof DynamicOptionControlModel) {
      if (isNotEmpty(fieldModel.options)) {
        fieldModel.options.forEach((option) => {
          option.label = this.translate.instant(this.OPTIONS_KEY_PREFIX + fieldModel.id + '.' + option.value);
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
    // TODO: Fetch field update and send to REST API
    this.initializeOriginalContentSource();
    this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
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
      this.contentSource.harvestType = ContentSourceHarvestType.Metadata;
    } else {
      this.contentSource.harvestType = ContentSourceHarvestType.None;
    }
    this.updateContentSource(false);
  }

  /**
   * Loop over all inputs and update the Content Source with their value
   */
  updateContentSource(updateHarvestType: boolean) {
    this.inputModels.forEach(
      (fieldModel: DynamicInputModel) => {
        this.updateContentSourceField(fieldModel, updateHarvestType)
      }
    );
    this.saveFieldUpdate();
  }

  /**
   * Update the Content Source with the value from a DynamicInputModel
   * @param fieldModel
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
   * Make sure open subscriptions are closed
   */
  ngOnDestroy(): void {
    this.updateSub.unsubscribe();
  }
}
