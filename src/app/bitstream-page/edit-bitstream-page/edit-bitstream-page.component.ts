import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import {
 BehaviorSubject, combineLatest,
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { UntypedFormGroup, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  DynamicCustomSwitchModel
} from '../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';
import cloneDeep from 'lodash/cloneDeep';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload, } from '../../core/shared/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Metadata } from '../../core/shared/metadata.utils';
import { Location } from '@angular/common';
import { RemoteData } from '../../core/data/remote-data';
import { getEntityEditRoute } from '../../item-page/item-page-routing-paths';
import { Bundle } from '../../core/shared/bundle.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Item } from '../../core/shared/item.model';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DsDynamicTextAreaModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { PrimaryBitstreamService } from '../../core/data/primary-bitstream.service';
import { DynamicScrollableDropdownModel } from 'src/app/shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FindAllDataImpl } from '../../core/data/base/find-all-data';
import { ObservablesDictionary } from 'src/app/shared/utils/observables-dictionary';

/**
 * All data that is required before the form can be created and filled.
 */
export interface DataObjects {
  bitstream: Bitstream,
  bitstreamFormat: BitstreamFormat,
  bundle: Bundle,
  primaryBitstream: Bitstream,
  item: Item,
}

/**
 * The results after updating all the fields on submission.
 */
export interface UpdateResult {
  metadataUpdateRD: RemoteData<Bitstream>,
  primaryUpdateRD: RemoteData<Bundle>,
  formatUpdateRD: RemoteData<Bitstream>,
}

/**
 * Key prefix used to generate form messages
 */
export const KEY_PREFIX = 'bitstream.edit.form.';

/**
 * Key suffix used to generate form labels
 */
export const LABEL_KEY_SUFFIX = '.label';

/**
 * Key suffix used to generate form labels
 */
export const HINT_KEY_SUFFIX = '.hint';

/**
 * Key prefix used to generate notification messages
 */
export const NOTIFICATIONS_PREFIX = 'bitstream.edit.notifications.';

/**
 * IIIF image width metadata key
 */
export const IMAGE_WIDTH_METADATA = 'iiif.image.width';

/**
 * IIIF image height metadata key
 */
export const IMAGE_HEIGHT_METADATA = 'iiif.image.height';

/**
 * IIIF table of contents metadata key
 */
export const IIIF_TOC_METADATA = 'iiif.toc';

/**
 * IIIF label metadata key
 */
export const IIIF_LABEL_METADATA = 'iiif.label';

@Component({
  selector: 'ds-edit-bitstream-page',
  styleUrls: ['./edit-bitstream-page.component.scss'],
  templateUrl: './edit-bitstream-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Page component for editing a bitstream
 */
export class EditBitstreamPageComponent implements OnInit, OnDestroy {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * The bitstream's remote data observable
   * Tracks changes and updates the view
   */
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  /**
   * The UUID of the primary bitstream for this bundle
   */
  primaryBitstreamUUID: string;

  /**
   * The bitstream to edit
   */
  bitstream: Bitstream;

  /**
   * The format of the bitstream to edit
   */
  bitstreamFormat: BitstreamFormat;

  /**
   * The item that the bitstream belongs to
   */
  item: Item;

  /**
   * Options for fetching all bitstream formats
   */
  findAllOptions = {
    elementsPerPage: 20,
    currentPage: 1
  };

  /**
   * The Dynamic Input Model for the file's name
   */
  fileNameModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'fileName',
    name: 'fileName',
    required: true,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'You must provide a file name for the bitstream'
    }
  });

  /**
   * The Dynamic Switch Model for the file's name
   */
  primaryBitstreamModel = new DynamicCustomSwitchModel({
      id: 'primaryBitstream',
      name: 'primaryBitstream'
    }
  );

  /**
   * The Dynamic TextArea Model for the file's description
   */
  descriptionModel = new DsDynamicTextAreaModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'description',
    name: 'description',
    rows: 10
  });

  /**
   * The Dynamic Input Model for the selected format
   */
  selectedFormatModel = new DynamicScrollableDropdownModel({
    id: 'selectedFormat',
    name: 'selectedFormat',
    displayKey: 'shortDescription',
    repeatable: false,
    metadataFields: [],
    submissionId: '',
    hasSelectableMetadata: false,
    findAllFactory: this.findAllFormatsServiceFactory(),
    formatFunction: (format: BitstreamFormat | string) => {
      if (format instanceof  BitstreamFormat) {
        return hasValue(format) && format.supportLevel === BitstreamFormatSupportLevel.Unknown ? this.translate.instant(KEY_PREFIX + 'selectedFormat.unknown') : format.shortDescription;
      } else {
        return format;
      }
    },
  });

  /**
   * The Dynamic Input Model for supplying more format information
   */
  newFormatModel = new DynamicInputModel({
    id: 'newFormat',
    name: 'newFormat'
  });

  /**
   * The Dynamic Input Model for the iiif label
   */
  iiifLabelModel = new DsDynamicInputModel({
      hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
      id: 'iiifLabel',
      name: 'iiifLabel'
    },
    {
      grid: {
        host: 'col col-lg-6 d-inline-block'
      }
    });
  iiifLabelContainer = new DynamicFormGroupModel({
    id: 'iiifLabelContainer',
    group: [this.iiifLabelModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifTocModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifToc',
    name: 'iiifToc',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifTocContainer = new DynamicFormGroupModel({
    id: 'iiifTocContainer',
    group: [this.iiifTocModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifWidthModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifWidth',
    name: 'iiifWidth',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifWidthContainer = new DynamicFormGroupModel({
    id: 'iiifWidthContainer',
    group: [this.iiifWidthModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  iiifHeightModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifHeight',
    name: 'iiifHeight'
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block'
    }
  });
  iiifHeightContainer = new DynamicFormGroupModel({
    id: 'iiifHeightContainer',
    group: [this.iiifHeightModel]
  }, {
    grid: {
      host: 'form-row'
    }
  });

  /**
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.fileNameModel, this.primaryBitstreamModel, this.descriptionModel, this.selectedFormatModel,
    this.newFormatModel];

  /**
   * The dynamic form fields used for editing the information of a bitstream
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'fileNamePrimaryContainer',
      group: [
        this.fileNameModel,
        this.primaryBitstreamModel
      ]
    }, {
      grid: {
        host: 'form-row'
      }
    }),
    new DynamicFormGroupModel({
      id: 'descriptionContainer',
      group: [
        this.descriptionModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'formatContainer',
      group: [
        this.selectedFormatModel,
        this.newFormatModel
      ]
    })
  ];

  /**
   * The base layout of the "Other Format" input
   */
  newFormatBaseLayout = 'col col-sm-6 d-inline-block';

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    fileName: {
      grid: {
        host: 'col col-sm-8 d-inline-block'
      }
    },
    primaryBitstream: {
      grid: {
        host: 'col col-sm-4 d-inline-block switch border-0'
      }
    },
    description: {
      grid: {
        host: 'col-12 d-inline-block'
      }
    },
    embargo: {
      grid: {
        host: 'col-12 d-inline-block'
      }
    },
    selectedFormat: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    newFormat: {
      grid: {
        host: this.newFormatBaseLayout + ' invisible'
      }
    },
    fileNamePrimaryContainer: {
      grid: {
        host: 'row position-relative'
      }
    },
    descriptionContainer: {
      grid: {
        host: 'row'
      }
    },
    formatContainer: {
      grid: {
        host: 'row'
      }
    }
  };

  /**
   * The form group of this form
   */
  formGroup: UntypedFormGroup;

  /**
   * The entity type of the item the bitstream originates from
   * Taken from the current query parameters when present
   * This will determine the route of the item edit page to return to
   */
  entityType: string;

  /**
   * Set to true when the parent item supports IIIF.
   */
  isIIIF = false;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The parent bundle containing the Bitstream
   * @private
   */
  private bundle: Bundle;
  /**
   * The currently selected format
   * @private
   */
  private selectedFormat: BitstreamFormat;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private location: Location,
              private formService: DynamicFormService,
              private translate: TranslateService,
              private bitstreamService: BitstreamDataService,
              public dsoNameService: DSONameService,
              private notificationsService: NotificationsService,
              private bitstreamFormatService: BitstreamFormatDataService,
              private primaryBitstreamService: PrimaryBitstreamService,
  ) {
  }

  /**
   * Initialize the component
   * - Create a FormGroup using the FormModel defined earlier
   * - Subscribe on the route data to fetch the bitstream to edit and update the form values
   * - Translate the form labels and hints
   */
  ngOnInit(): void {
    this.bitstreamRD$ = this.route.data.pipe(map((data: any) => data.bitstream));

    const dataObservables = this.getDataObservables();

    this.subs.push(
      observableCombineLatest(
        dataObservables
      ).pipe()
        .subscribe((dataObjects: DataObjects) => {
          this.isLoading$.next(false);

          this.setFields(dataObjects);

          this.setForm();
        })
    );

    this.subs.push(
      this.translate.onLangChange
        .subscribe(() => {
          this.updateFieldTranslations();
        })
    );
  }

  /**
   * Create all the observables necessary to create and fill the bitstream form,
   * and collect them in a {@link ObservablesDictionary} object.
   */
  protected getDataObservables(): ObservablesDictionary<DataObjects> {
    const bitstream$ = this.bitstreamRD$.pipe(
      getFirstSucceededRemoteDataPayload()
    );

    const bitstreamFormat$ = bitstream$.pipe(
      switchMap((bitstream: Bitstream) => this.bitstreamFormatService.findByHref(bitstream._links.format.href, false)),
      getFirstSucceededRemoteDataPayload(),
    );

    const bundle$ = bitstream$.pipe(
      switchMap((bitstream: Bitstream) => bitstream.bundle),
      getFirstSucceededRemoteDataPayload(),
    );

    const primaryBitstream$ = bundle$.pipe(
      hasValueOperator(),
      switchMap((bundle: Bundle) => this.bitstreamService.findByHref(bundle._links.primaryBitstream.href, false)),
      getFirstSucceededRemoteDataPayload(),
    );

    const item$ = bundle$.pipe(
      switchMap((bundle: Bundle) => bundle.item),
      getFirstSucceededRemoteDataPayload(),
    );

    return {
      bitstream: bitstream$,
      bitstreamFormat: bitstreamFormat$,
      bundle: bundle$,
      primaryBitstream: primaryBitstream$,
      item: item$,
    };
  }

  /**
   * Sets all required fields with the data in the provided dataObjects
   * @protected
   */
  protected setFields(dataObjects: DataObjects) {
    this.bitstream = dataObjects.bitstream;
    this.bitstreamFormat = dataObjects.bitstreamFormat;
    this.selectedFormat = dataObjects.bitstreamFormat;
    this.bundle = dataObjects.bundle;
    // hasValue(primaryBitstream) because if there's no primaryBitstream on the bundle it will
    // be a success response, but empty
    this.primaryBitstreamUUID = hasValue(dataObjects.primaryBitstream) ? dataObjects.primaryBitstream.uuid : null;
    this.item = dataObjects.item;

    this.isIIIF = this.getIiifStatus();
  }

  /**
   * Initializes the form.
   */
  setForm() {
    this.updateFormModel();
    this.formGroup = this.getFormGroup();

    this.updateForm();
    this.updateFieldTranslations();

    this.changeDetectorRef.detectChanges();
  }

  /**
   * Updates the formModel with additional fields & options, depending on the current data
   */
  updateFormModel() {
    if (this.isIIIF) {
      this.appendFormWithIiifFields();
    }
  }

  /**
   * Creates a formGroup from the current formModel
   */
  getFormGroup(): FormGroup {
    return this.formService.createFormGroup(this.formModel);
  }

  /**
   * Update the current form values with the current bitstream properties
   */
  updateForm() {
    const bitstream = this.bitstream;

    this.formGroup.patchValue({
      fileNamePrimaryContainer: {
        fileName: this.dsoNameService.getName(bitstream),
        primaryBitstream: this.primaryBitstreamUUID === bitstream.uuid
      },
      descriptionContainer: {
        description: bitstream.firstMetadataValue('dc.description')
      },
      formatContainer: {
        selectedFormat: this.selectedFormat.shortDescription,
        newFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined,
      },
    });
    if (this.isIIIF) {
      this.formGroup.patchValue({
        iiifLabelContainer: {
          iiifLabel: bitstream.firstMetadataValue(IIIF_LABEL_METADATA)
        },
        iiifTocContainer: {
          iiifToc: bitstream.firstMetadataValue(IIIF_TOC_METADATA)
        },
        iiifWidthContainer: {
          iiifWidth: bitstream.firstMetadataValue(IMAGE_WIDTH_METADATA)
        },
        iiifHeightContainer: {
          iiifHeight: bitstream.firstMetadataValue(IMAGE_HEIGHT_METADATA)
        }
      });
    }

    this.updateNewFormatLayout();
  }


  /**
   * Update the layout of the "Other Format" input depending on the selected format
   * @param selectedId
   */
  updateNewFormatLayout() {
    if (this.isUnknownFormat()) {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout;
    } else {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout + ' invisible';
    }
  }

  /**
   * Is the provided format (id) part of the list of unknown formats?
   * @param id
   */
  isUnknownFormat(): boolean {
    return hasValue(this.selectedFormat) &&  this.selectedFormat.supportLevel === BitstreamFormatSupportLevel.Unknown;
  }

  /**
   * Used to update translations of labels and hints on init and on language change
   */
  private updateFieldTranslations() {
    this.inputModels.forEach(
      (fieldModel: DynamicFormControlModel) => {
        this.updateFieldTranslation(fieldModel);
      }
    );
  }

  /**
   * Update the translations of a DynamicFormControlModel
   * @param fieldModel
   */
  private updateFieldTranslation(fieldModel) {
    fieldModel.label = this.translate.instant(KEY_PREFIX + fieldModel.id + LABEL_KEY_SUFFIX);
    if (fieldModel.id !== this.primaryBitstreamModel.id) {
      fieldModel.hint = this.translate.instant(KEY_PREFIX + fieldModel.id + HINT_KEY_SUFFIX);
    }
  }

  /**
   * Fired whenever the form receives an update and changes the layout of the "Other Format" input, depending on the selected format
   * @param event
   */
  onChange(event) {
    const model = event.model;
    if (model.id === this.selectedFormatModel.id) {
      this.selectedFormat = model.value;
      this.updateNewFormatLayout();
    }
  }

  /**
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    const updatedValues = this.formGroup.getRawValue();

    this.subs.push(combineLatest(this.getUpdateObservables(updatedValues))
      .subscribe((updateResult: UpdateResult) => {
        this.handleUpdateResult(updateResult);
      })
    );
  }

  /**
   * Collects all observables that update the different parts of the bitstream.
   */
  getUpdateObservables(updatedValues: any): ObservablesDictionary<UpdateResult> {
    return {
      metadataUpdateRD: this.updateBitstreamMetadataRD$(updatedValues),
      primaryUpdateRD: this.updatePrimaryBitstreamRD$(updatedValues),
      formatUpdateRD: this.updateBitstreamFormatRD$(),
    };
  }

  /**
   * Creates and returns an observable that updates the bitstream metadata according to the data in the form.
   */
  updateBitstreamMetadataRD$(updatedValues: any): Observable<RemoteData<Bitstream>> {
    const updatedBitstream = this.formToBitstream(updatedValues);

    return this.bitstreamService.update(updatedBitstream).pipe(
      getFirstCompletedRemoteData()
    );
  }

  /**
   * Creates and returns an observable that will update the primary bitstream in the bundle of the
   * current bitstream, if necessary according to the provided updated values.
   * When an update is necessary, the observable fires once with the completed RemoteData of the bundle update.
   * When no update is necessary, the observable fires once with a null value.
   * @param updatedValues The raw updated values in the bitstream edit form
   */
  updatePrimaryBitstreamRD$(updatedValues: any): Observable<RemoteData<Bundle>> {
    // Whether the edited bitstream should be the primary bitstream according to the form
    const shouldBePrimary: boolean = updatedValues.fileNamePrimaryContainer.primaryBitstream;
    // Whether the edited bitstream currently is the primary bitstream
    const isPrimary = this.primaryBitstreamUUID === this.bitstream.uuid;

    // If the primary bitstream status should not be changed, there is nothing to do
    if (shouldBePrimary === isPrimary) {
      return observableOf(null);
    }

    let updatedBundleRD$: Observable<RemoteData<Bundle>>;
    if (isPrimary) {
      updatedBundleRD$ = this.primaryBitstreamService.delete(this.bundle);
    } else if (hasValue(this.primaryBitstreamUUID)) {
      updatedBundleRD$ = this.primaryBitstreamService.put(this.bitstream, this.bundle);
    } else {
      updatedBundleRD$ = this.primaryBitstreamService.create(this.bitstream, this.bundle);
    }

    return updatedBundleRD$.pipe(
      getFirstCompletedRemoteData()
    );
  }

  /**
   * Creates and returns an observable that will update the bitstream format
   * if necessary according to the provided updated values.
   * When an update is necessary, the observable fires once with the completed RemoteData of the bitstream update.
   * When no update is necessary, the observable fires once with a null value.
   * @param updatedValues The raw updated values in the bitstream edit form
   */
  updateBitstreamFormatRD$(): Observable<RemoteData<Bitstream>> {
    const selectedFormat = this.selectedFormat;
    const formatChanged = selectedFormat.id !== this.bitstreamFormat.id;

    // If the format has not changed, there is nothing to do
    if (!formatChanged) {
      return observableOf(null);
    }

    return this.bitstreamService.updateFormat(this.bitstream, selectedFormat).pipe(
      getFirstCompletedRemoteData(),
    );
  }

  /**
   * Parse form data to an updated bitstream object
   * @param rawForm   Raw form data
   */
  formToBitstream(rawForm): Bitstream {
    const updatedBitstream = cloneDeep(this.bitstream);
    const newMetadata = updatedBitstream.metadata;
    Metadata.setFirstValue(newMetadata, 'dc.title', rawForm.fileNamePrimaryContainer.fileName);
    if (isEmpty(rawForm.descriptionContainer.description)) {
      delete newMetadata['dc.description'];
    } else {
      Metadata.setFirstValue(newMetadata, 'dc.description', rawForm.descriptionContainer.description);
    }
    if (this.isIIIF) {
      // It's helpful to remove these metadata elements entirely when the form value is empty.
      // This avoids potential issues on the REST side and makes it possible to do things like
      // remove an existing "table of contents" entry.
      if (isEmpty(rawForm.iiifLabelContainer.iiifLabel)) {

        delete newMetadata[IIIF_LABEL_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, IIIF_LABEL_METADATA, rawForm.iiifLabelContainer.iiifLabel);
      }
      if (isEmpty(rawForm.iiifTocContainer.iiifToc)) {
        delete newMetadata[IIIF_TOC_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, IIIF_TOC_METADATA, rawForm.iiifTocContainer.iiifToc);
      }
      if (isEmpty(rawForm.iiifWidthContainer.iiifWidth)) {
        delete newMetadata[IMAGE_WIDTH_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, IMAGE_WIDTH_METADATA, rawForm.iiifWidthContainer.iiifWidth);
      }
      if (isEmpty(rawForm.iiifHeightContainer.iiifHeight)) {
        delete newMetadata[IMAGE_HEIGHT_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, IMAGE_HEIGHT_METADATA, rawForm.iiifHeightContainer.iiifHeight);
      }
    }
    if (isNotEmpty(rawForm.formatContainer.newFormat)) {
      Metadata.setFirstValue(newMetadata, 'dc.format', rawForm.formatContainer.newFormat);
    }
    updatedBitstream.metadata = newMetadata;
    return updatedBitstream;
  }

  /**
   * Handle the update result by checking for errors.
   * When there are no errors, the user is redirected to the edit-bitstreams page.
   * When there are errors, a notification is shown.
   */
  handleUpdateResult(updateResult: UpdateResult) {
    let errorWhileSaving = false;

    // Check for errors during the primary bitstream update
    const primaryUpdateRD = updateResult.primaryUpdateRD;
    if (hasValue(primaryUpdateRD) && primaryUpdateRD.hasFailed) {
      this.notificationsService.error(
        this.translate.instant(NOTIFICATIONS_PREFIX + 'error.primaryBitstream.title'),
        primaryUpdateRD.errorMessage
      );

      errorWhileSaving = true;
    }

    // Check for errors during the bitstream format update
    const formatUpdateRD = updateResult.formatUpdateRD;
    if (hasValue(formatUpdateRD) && formatUpdateRD.hasFailed) {
      this.notificationsService.error(
        this.translate.instant(NOTIFICATIONS_PREFIX + 'error.format.title'),
        formatUpdateRD.errorMessage
      );

      errorWhileSaving = true;
    }

    this.bitstreamService.commitUpdates();
    this.notificationsService.success(
      this.translate.instant(NOTIFICATIONS_PREFIX + 'saved.title'),
      this.translate.instant(NOTIFICATIONS_PREFIX + 'saved.content')
    );

    if (!errorWhileSaving) {
      this.navigateToItemEditBitstreams();
    }
  }

  /**
   * Cancel the form and return to the previous page
   */
  onCancel() {
    this.navigateToItemEditBitstreams();
  }

  /**
   * Navigate back to the item's edit bitstreams page
   */
  navigateToItemEditBitstreams() {
    void this.router.navigate([getEntityEditRoute(null, this.item.uuid), 'bitstreams']);
  }

  /**
   * Verifies that the parent item is iiif-enabled. Checks bitstream mimetype to be
   * sure it's an image, excluding bitstreams in the THUMBNAIL or OTHERCONTENT bundles.
   */
  getIiifStatus(): boolean {

    const regexExcludeBundles = /OTHERCONTENT|THUMBNAIL|LICENSE/;
    const regexIIIFItem = /true|yes/i;

    const isImage = this.bitstreamFormat.mimetype.includes('image/');

    const isIIIFBundle = this.dsoNameService.getName(this.bundle).match(regexExcludeBundles) === null;

    const isEnabled =
      this.item.firstMetadataValue('dspace.iiif.enabled') &&
      this.item.firstMetadataValue('dspace.iiif.enabled').match(regexIIIFItem) !== null;

    return isImage && isIIIFBundle && isEnabled;
  }

  /**
   * Extend the form with IIIF fields
   */
  appendFormWithIiifFields(): void {
    this.inputModels.push(this.iiifLabelModel);
    this.formModel.push(this.iiifLabelContainer);
    this.inputModels.push(this.iiifTocModel);
    this.formModel.push(this.iiifTocContainer);
    this.inputModels.push(this.iiifWidthModel);
    this.formModel.push(this.iiifWidthContainer);
    this.inputModels.push(this.iiifHeightModel);
    this.formModel.push(this.iiifHeightContainer);
  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  findAllFormatsServiceFactory() {
    return () => this.bitstreamFormatService as any as FindAllDataImpl<BitstreamFormat>;
  }
}
