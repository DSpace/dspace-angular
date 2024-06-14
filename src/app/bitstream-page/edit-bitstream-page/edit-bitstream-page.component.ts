import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  BehaviorSubject, combineLatest, combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription
} from 'rxjs';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';
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
import { PaginatedList } from '../../core/data/paginated-list.model';
import { getEntityEditRoute } from '../../item-page/item-page-routing-paths';
import { Bundle } from '../../core/shared/bundle.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Item } from '../../core/shared/item.model';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DsDynamicTextAreaModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { PrimaryBitstreamService } from '../../core/data/primary-bitstream.service';

/**
 * All observables that have to return their data before the form can be created and filled. Objects of
 * the {@link DataObservables} type can directly be used in a 'combineLatest' method to get their values
 * once all the observables have fired, and the resulting object will be of the {@link DataObjects} type.
 * This interface does not follow the usual convention of appending the dollar ($) symbol to variables
 * representing observables, as rxjs will map those names 1-to-1 to the resulting object when used in a
 * 'combineLatest' method.
 */
interface DataObservables {
  [key: string]: Observable<any>;

  bitstream: Observable<Bitstream>,
  bitstreamFormat: Observable<BitstreamFormat>,
  bitstreamFormatOptions: Observable<PaginatedList<BitstreamFormat>>,
  bundle: Observable<Bundle>,
  primaryBitstream: Observable<Bitstream>,
  item: Observable<Item>,
}

interface DataObjects {
  [key: string]: any;

  bitstream: Bitstream,
  bitstreamFormat: BitstreamFormat,
  bitstreamFormatOptions: PaginatedList<BitstreamFormat>,
  bundle: Bundle,
  primaryBitstream: Bitstream,
  item: Item,
}

/**
 * Key prefix used to generate form messages
 */
const KEY_PREFIX = 'bitstream.edit.form.';

/**
 * Key suffix used to generate form labels
 */
const LABEL_KEY_SUFFIX = '.label';

/**
 * Key suffix used to generate form labels
 */
const HINT_KEY_SUFFIX = '.hint';

/**
 * Key prefix used to generate notification messages
 */
const NOTIFICATIONS_PREFIX = 'bitstream.edit.notifications.';

/**
 * IIIF image width metadata key
 */
const IMAGE_WIDTH_METADATA = 'iiif.image.width';

/**
 * IIIF image height metadata key
 */
const IMAGE_HEIGHT_METADATA = 'iiif.image.height';

/**
 * IIIF table of contents metadata key
 */
const IIIF_TOC_METADATA = 'iiif.toc';

/**
 * IIIF label metadata key
 */
const IIIF_LABEL_METADATA = 'iiif.label';

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
   * A list of all available bitstream formats
   */
  formatOptions: BitstreamFormat[];

  /**
   * The item that the bitstream belongs to
   */
  item: Item;

  /**
   * Options for fetching all bitstream formats
   */
  findAllOptions = { elementsPerPage: 9999 };

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
  selectedFormatModel = new DynamicSelectModel({
    id: 'selectedFormat',
    name: 'selectedFormat'
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
   * and collect them in a {@link DataObservables} object.
   */
  protected getDataObservables(): DataObservables {
    const bitstreamFormatOptionsRD$ = this.bitstreamFormatService.findAll(this.findAllOptions);

    const bitstream$ = this.bitstreamRD$.pipe(
      getFirstSucceededRemoteDataPayload()
    );

    const bitstreamFormat$ = bitstream$.pipe(
      switchMap((bitstream: Bitstream) => bitstream.format),
      getFirstSucceededRemoteDataPayload(),
    );

    const bitstreamFormatOptions$ = bitstreamFormatOptionsRD$.pipe(
      getFirstSucceededRemoteDataPayload()
    );

    const bundle$ = bitstream$.pipe(
      switchMap((bitstream: Bitstream) => bitstream.bundle),
      getFirstSucceededRemoteDataPayload(),
    );

    const primaryBitstream$ = bundle$.pipe(
      hasValueOperator(),
      switchMap((bundle: Bundle) => this.bitstreamService.findByHref(bundle._links.primaryBitstream.href)),
      getFirstSucceededRemoteDataPayload(),
    );

    const item$ = bundle$.pipe(
      switchMap((bundle: Bundle) => bundle.item),
      getFirstSucceededRemoteDataPayload(),
    );

    return {
      bitstream: bitstream$,
      bitstreamFormat: bitstreamFormat$,
      bitstreamFormatOptions: bitstreamFormatOptions$,
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
    this.formatOptions = dataObjects.bitstreamFormatOptions.page;
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
    this.updateFormatModel();

    if (this.isIIIF) {
      this.appendFormWIthIiifFields();
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
    const format = this.bitstreamFormat;

    this.formGroup.patchValue({
      fileNamePrimaryContainer: {
        fileName: this.dsoNameService.getName(bitstream),
        primaryBitstream: this.primaryBitstreamUUID === bitstream.uuid
      },
      descriptionContainer: {
        description: bitstream.firstMetadataValue('dc.description')
      },
      formatContainer: {
        newFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined
      }
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

    this.bitstreamFormat = format;
    this.formGroup.patchValue({
      formatContainer: {
        selectedFormat: format.id
      }
    });
    this.updateNewFormatLayout(format.id);
  }

  /**
   * Create the list of unknown format IDs an add options to the selectedFormatModel
   */
  updateFormatModel() {
    this.selectedFormatModel.options = this.formatOptions.map((format: BitstreamFormat) =>
      Object.assign({
        value: format.id,
        label: this.isUnknownFormat(format.id) ? this.translate.instant(KEY_PREFIX + 'selectedFormat.unknown') : format.shortDescription
      }));
  }

  /**
   * Update the layout of the "Other Format" input depending on the selected format
   * @param selectedId
   */
  updateNewFormatLayout(selectedId: string) {
    if (this.isUnknownFormat(selectedId)) {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout;
    } else {
      this.formLayout.newFormat.grid.host = this.newFormatBaseLayout + ' invisible';
    }
  }

  /**
   * Is the provided format (id) part of the list of unknown formats?
   * @param id
   */
  isUnknownFormat(id: string): boolean {
    const format = this.formatOptions.find((f: BitstreamFormat) => f.id === id);
    return hasValue(format) && format.supportLevel === BitstreamFormatSupportLevel.Unknown;
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
      this.updateNewFormatLayout(model.value);
    }
  }

  /**
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    const updatedValues = this.formGroup.getRawValue();
    const updatedBitstream = this.formToBitstream(updatedValues);
    const selectedFormat = this.formatOptions.find((f: BitstreamFormat) => f.id === updatedValues.formatContainer.selectedFormat);
    const isNewFormat = selectedFormat.id !== this.bitstreamFormat.id;
    const isPrimary = updatedValues.fileNamePrimaryContainer.primaryBitstream;
    const wasPrimary = this.primaryBitstreamUUID === this.bitstream.uuid;

    let bitstream$: Observable<Bitstream>;
    let bundle$: Observable<Bundle>;
    let errorWhileSaving = false;

    if (wasPrimary !== isPrimary) {
      let bundleRd$: Observable<RemoteData<Bundle>>;
      if (wasPrimary) {
        bundleRd$ = this.primaryBitstreamService.delete(this.bundle);
      } else if (hasValue(this.primaryBitstreamUUID)) {
        bundleRd$ = this.primaryBitstreamService.put(this.bitstream, this.bundle);
      } else {
        bundleRd$ = this.primaryBitstreamService.create(this.bitstream, this.bundle);
      }

      bundle$ = bundleRd$.pipe(
        getFirstCompletedRemoteData(),
        // If the request succeeded, use the new bundle data
        // Otherwise send a notification and use the old bundle data
        switchMap((bundleRd: RemoteData<Bundle>) => {
          if (bundleRd.hasSucceeded) {
            return observableOf(bundleRd.payload);
          } else {
            this.notificationsService.error(
              this.translate.instant(NOTIFICATIONS_PREFIX + 'error.primaryBitstream.title'),
              bundleRd.errorMessage
            );
            errorWhileSaving = true;

            return observableOf(this.bundle);
          }
        }),
        // Set the primary bitstream ID depending on the available bundle data
        switchMap((bundle) => {
          return this.bitstreamService.findByHref(bundle._links.primaryBitstream.href, false).pipe(
            getFirstSucceededRemoteDataPayload(),
            tap((bitstream: Bitstream) => {
              this.primaryBitstreamUUID = hasValue(bitstream) ? bitstream.uuid : null;
            }),
            map((_) => {
              return bundle;
            })
          );
        }),
      );

    } else {
      bundle$ = observableOf(this.bundle);
    }

    if (isNewFormat) {
      bitstream$ = this.bitstreamService.updateFormat(this.bitstream, selectedFormat).pipe(
        getFirstCompletedRemoteData(),
        map((formatResponse: RemoteData<Bitstream>) => {
          if (hasValue(formatResponse) && formatResponse.hasFailed) {
            this.notificationsService.error(
              this.translate.instant(NOTIFICATIONS_PREFIX + 'error.format.title'),
              formatResponse.errorMessage
            );
          } else {
            return formatResponse.payload;
          }
        })
      );
    } else {
      bitstream$ = observableOf(this.bitstream);
    }

    this.subs.push(combineLatest([bundle$, bitstream$]).pipe(
      tap(([bundle]) => this.bundle = bundle),
      switchMap(() => {
        return this.bitstreamService.update(updatedBitstream).pipe(
          getFirstSucceededRemoteDataPayload()
        );
      })
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.notificationsService.success(
        this.translate.instant(NOTIFICATIONS_PREFIX + 'saved.title'),
        this.translate.instant(NOTIFICATIONS_PREFIX + 'saved.content')
      );
      if (!errorWhileSaving) {
        this.navigateToItemEditBitstreams();
      }
    }));
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

  appendFormWIthIiifFields(): void {
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

}
