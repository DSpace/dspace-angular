import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import {
  combineLatest,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { FindAllDataImpl } from '../../core/data/base/find-all-data';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { PrimaryBitstreamService } from '../../core/data/primary-bitstream.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BITSTREAM_FORMAT } from '../../core/shared/bitstream-format.resource-type';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { Bundle } from '../../core/shared/bundle.model';
import { Item } from '../../core/shared/item.model';
import { Metadata } from '../../core/shared/metadata.utils';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../core/shared/operators';
import { getEntityEditRoute } from '../../item-page/item-page-routing-paths';
import {
  hasValue,
  hasValueOperator,
  isEmpty,
  isNotEmpty,
} from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { DynamicCustomSwitchModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DsDynamicTextAreaModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { DynamicScrollableDropdownModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormComponent } from '../../shared/form/form.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-base-edit-bitstream-page',
  styleUrls: ['./edit-bitstream-page.component.scss'],
  templateUrl: './edit-bitstream-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ErrorComponent,
    FileSizePipe,
    FormComponent,
    RouterLink,
    ThemedLoadingComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * Page component for editing a bitstream
 */
export class EditBitstreamPageComponent implements OnInit, OnDestroy {

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
   * The originally selected format
   */
  originalFormat: BitstreamFormat;

  /**
   * @type {string} Key prefix used to generate form messages
   */
  KEY_PREFIX = 'bitstream.edit.form.';

  /**
   * @type {string} Key suffix used to generate form labels
   */
  LABEL_KEY_SUFFIX = '.label';

  /**
   * @type {string} Key suffix used to generate form labels
   */
  HINT_KEY_SUFFIX = '.hint';

  /**
   * @type {string} Key prefix used to generate notification messages
   */
  NOTIFICATIONS_PREFIX = 'bitstream.edit.notifications.';

  /**
   * IIIF image width metadata key
   */
  IMAGE_WIDTH_METADATA = 'iiif.image.width';

  /**
   * IIIF image height metadata key
   */
  IMAGE_HEIGHT_METADATA = 'iiif.image.height';

  /**
   * IIIF table of contents metadata key
   */
  IIIF_TOC_METADATA = 'iiif.toc';

  /**
   * IIIF label metadata key
   */
  IIIF_LABEL_METADATA = 'iiif.label';

  /**
   * Options for fetching all bitstream formats
   */
  findAllOptions = {
    elementsPerPage: 20,
    currentPage: 1,
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
      required: null,
    },
    errorMessages: {
      required: 'You must provide a file name for the bitstream',
    },
  });

  /**
   * The Dynamic Switch Model for the file's name
   */
  primaryBitstreamModel = new DynamicCustomSwitchModel({
    id: 'primaryBitstream',
    name: 'primaryBitstream',
  },
  );

  /**
   * The Dynamic TextArea Model for the file's description
   */
  descriptionModel = new DsDynamicTextAreaModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'description',
    name: 'description',
    rows: 10,
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
    resourceType: BITSTREAM_FORMAT,
    formatFunction: (format: BitstreamFormat | string) => {
      if (format instanceof  BitstreamFormat) {
        return hasValue(format) && format.supportLevel === BitstreamFormatSupportLevel.Unknown ? this.translate.instant(this.KEY_PREFIX + 'selectedFormat.unknown') : format.shortDescription;
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
    name: 'newFormat',
  });

  /**
   * The Dynamic Input Model for the iiif label
   */
  iiifLabelModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifLabel',
    name: 'iiifLabel',
  },
  {
    grid: {
      host: 'col col-lg-6 d-inline-block',
    },
  });
  iiifLabelContainer = new DynamicFormGroupModel({
    id: 'iiifLabelContainer',
    group: [this.iiifLabelModel],
  }, {
    grid: {
      host: 'row',
    },
  });

  iiifTocModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifToc',
    name: 'iiifToc',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block',
    },
  });
  iiifTocContainer = new DynamicFormGroupModel({
    id: 'iiifTocContainer',
    group: [this.iiifTocModel],
  }, {
    grid: {
      host: 'row',
    },
  });

  iiifWidthModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifWidth',
    name: 'iiifWidth',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block',
    },
  });
  iiifWidthContainer = new DynamicFormGroupModel({
    id: 'iiifWidthContainer',
    group: [this.iiifWidthModel],
  }, {
    grid: {
      host: 'row',
    },
  });

  iiifHeightModel = new DsDynamicInputModel({
    hasSelectableMetadata: false, metadataFields: [], repeatable: false, submissionId: '',
    id: 'iiifHeight',
    name: 'iiifHeight',
  }, {
    grid: {
      host: 'col col-lg-6 d-inline-block',
    },
  });
  iiifHeightContainer = new DynamicFormGroupModel({
    id: 'iiifHeightContainer',
    group: [this.iiifHeightModel],
  }, {
    grid: {
      host: 'row',
    },
  });

  /**
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.primaryBitstreamModel, this.fileNameModel, this.descriptionModel, this.selectedFormatModel,
    this.newFormatModel];

  /**
   * The dynamic form fields used for editing the information of a bitstream
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'fileNamePrimaryContainer',
      group: [
        this.primaryBitstreamModel,
        this.fileNameModel,
      ],
    }, {
      grid: {
        host: 'row',
      },
    }),
    new DynamicFormGroupModel({
      id: 'descriptionContainer',
      group: [
        this.descriptionModel,
      ],
    }),
    new DynamicFormGroupModel({
      id: 'formatContainer',
      group: [
        this.selectedFormatModel,
        this.newFormatModel,
      ],
    }),
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
        host: 'col col-sm-8 d-inline-block',
      },
    },
    primaryBitstream: {
      grid: {
        container: 'col-12',
      },
      element: {
        container: 'text-right',
      },
    },
    description: {
      grid: {
        host: 'col-12 d-inline-block',
      },
    },
    embargo: {
      grid: {
        host: 'col-12 d-inline-block',
      },
    },
    selectedFormat: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
    newFormat: {
      grid: {
        host: this.newFormatBaseLayout + ' invisible',
      },
    },
    fileNamePrimaryContainer: {
      grid: {
        host: 'row position-relative',
      },
    },
    descriptionContainer: {
      grid: {
        host: 'row',
      },
    },
    formatContainer: {
      grid: {
        host: 'row',
      },
    },
  };

  /**
   * The form group of this form
   */
  formGroup: UntypedFormGroup;

  /**
   * The ID of the item the bitstream originates from
   * Taken from the current query parameters when present
   * This will determine the route of the item edit page to return to
   */
  itemId: string;

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

    this.itemId = this.route.snapshot.queryParams.itemId;
    this.entityType = this.route.snapshot.queryParams.entityType;
    this.bitstreamRD$ = this.route.data.pipe(map((data: any) => data.bitstream));

    const bitstream$ = this.bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
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
    const format$ = bitstream$.pipe(
      switchMap(bitstream => bitstream.format),
      getFirstSucceededRemoteDataPayload(),
    );

    this.subs.push(
      observableCombineLatest(
        bitstream$,
        bundle$,
        primaryBitstream$,
        item$,
        format$,
      ).subscribe(([bitstream, bundle, primaryBitstream, item, format]) => {
        this.bitstream = bitstream as Bitstream;
        this.bundle = bundle;
        this.selectedFormat = format;
        // hasValue(primaryBitstream) because if there's no primaryBitstream on the bundle it will
        // be a success response, but empty
        this.primaryBitstreamUUID = hasValue(primaryBitstream) ? primaryBitstream.uuid : null;
        this.itemId = item.uuid;
        this.setIiifStatus(this.bitstream);
      }),
      format$.pipe(take(1)).subscribe(
        (format) => this.originalFormat = format,
      ),
    );

    this.subs.push(
      this.translate.onLangChange
        .subscribe(() => {
          this.updateFieldTranslations();
        }),
    );
  }

  /**
   * Initializes the form.
   */
  setForm() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.updateForm(this.bitstream);
    this.updateFieldTranslations();
  }

  /**
   * Update the current form values with bitstream properties
   * @param bitstream
   */
  updateForm(bitstream: Bitstream) {
    this.formGroup.patchValue({
      fileNamePrimaryContainer: {
        fileName: bitstream.name,
        primaryBitstream: this.primaryBitstreamUUID === bitstream.uuid,
      },
      descriptionContainer: {
        description: bitstream.firstMetadataValue('dc.description'),
      },
      formatContainer: {
        selectedFormat: this.selectedFormat.shortDescription,
        newFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined,
      },
    });
    if (this.isIIIF) {
      this.formGroup.patchValue({
        iiifLabelContainer: {
          iiifLabel: bitstream.firstMetadataValue(this.IIIF_LABEL_METADATA),
        },
        iiifTocContainer: {
          iiifToc: bitstream.firstMetadataValue(this.IIIF_TOC_METADATA),
        },
        iiifWidthContainer: {
          iiifWidth: bitstream.firstMetadataValue(this.IMAGE_WIDTH_METADATA),
        },
        iiifHeightContainer: {
          iiifHeight: bitstream.firstMetadataValue(this.IMAGE_HEIGHT_METADATA),
        },
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
      },
    );
  }

  /**
   * Update the translations of a DynamicFormControlModel
   * @param fieldModel
   */
  private updateFieldTranslation(fieldModel) {
    fieldModel.label = this.translate.instant(this.KEY_PREFIX + fieldModel.id + this.LABEL_KEY_SUFFIX);
    if (fieldModel.id !== this.primaryBitstreamModel.id) {
      fieldModel.hint = this.translate.instant(this.KEY_PREFIX + fieldModel.id + this.HINT_KEY_SUFFIX);
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
    const updatedBitstream = this.formToBitstream(updatedValues);
    const isNewFormat = this.selectedFormat.id !== this.originalFormat.id;
    const isPrimary = updatedValues.fileNamePrimaryContainer.primaryBitstream;
    const wasPrimary = this.primaryBitstreamUUID === this.bitstream.uuid;

    let bitstream$;
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

      const completedBundleRd$ = bundleRd$.pipe(getFirstCompletedRemoteData());

      this.subs.push(completedBundleRd$.pipe(
        filter((bundleRd: RemoteData<Bundle>) => bundleRd.hasFailed),
      ).subscribe((bundleRd: RemoteData<Bundle>) => {
        this.notificationsService.error(
          this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.primaryBitstream.title'),
          bundleRd.errorMessage,
        );
        errorWhileSaving = true;
      }));

      bundle$ = completedBundleRd$.pipe(
        map((bundleRd: RemoteData<Bundle>) => {
          if (bundleRd.hasSucceeded) {
            return bundleRd.payload;
          } else {
            return this.bundle;
          }
        }),
      );

      this.subs.push(bundle$.pipe(
        hasValueOperator(),
        switchMap((bundle: Bundle) => this.bitstreamService.findByHref(bundle._links.primaryBitstream.href, false)),
        getFirstSucceededRemoteDataPayload(),
      ).subscribe((bitstream: Bitstream) => {
        this.primaryBitstreamUUID = hasValue(bitstream) ? bitstream.uuid : null;
      }));

    } else {
      bundle$ = of(this.bundle);
    }
    if (isNewFormat) {
      bitstream$ = this.bitstreamService.updateFormat(this.bitstream, this.selectedFormat).pipe(
        getFirstCompletedRemoteData(),
        map((formatResponse: RemoteData<Bitstream>) => {
          if (hasValue(formatResponse) && formatResponse.hasFailed) {
            this.notificationsService.error(
              this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.format.title'),
              formatResponse.errorMessage,
            );
          } else {
            return formatResponse.payload;
          }
        }),
      );
    } else {
      bitstream$ = of(this.bitstream);
    }

    combineLatest([bundle$, bitstream$]).pipe(
      tap(([bundle]) => this.bundle = bundle),
      switchMap(() => {
        return this.bitstreamService.update(updatedBitstream).pipe(
          getFirstSucceededRemoteDataPayload(),
        );
      }),
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.notificationsService.success(
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.title'),
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.content'),
      );
      if (!errorWhileSaving) {
        this.navigateToItemEditBitstreams();
      }
    });
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

        delete newMetadata[this.IIIF_LABEL_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IIIF_LABEL_METADATA, rawForm.iiifLabelContainer.iiifLabel);
      }
      if (isEmpty(rawForm.iiifTocContainer.iiifToc)) {
        delete newMetadata[this.IIIF_TOC_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IIIF_TOC_METADATA, rawForm.iiifTocContainer.iiifToc);
      }
      if (isEmpty(rawForm.iiifWidthContainer.iiifWidth)) {
        delete newMetadata[this.IMAGE_WIDTH_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IMAGE_WIDTH_METADATA, rawForm.iiifWidthContainer.iiifWidth);
      }
      if (isEmpty(rawForm.iiifHeightContainer.iiifHeight)) {
        delete newMetadata[this.IMAGE_HEIGHT_METADATA];
      } else {
        Metadata.setFirstValue(newMetadata, this.IMAGE_HEIGHT_METADATA, rawForm.iiifHeightContainer.iiifHeight);
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
   * When the item ID is present, navigate back to the item's edit bitstreams page,
   * otherwise retrieve the item ID based on the owning bundle's link
   */
  navigateToItemEditBitstreams() {
    this.router.navigate([getEntityEditRoute(this.entityType, this.itemId), 'bitstreams']);
  }

  /**
   * Verifies that the parent item is iiif-enabled. Checks bitstream mimetype to be
   * sure it's an image, excluding bitstreams in the THUMBNAIL or OTHERCONTENT bundles.
   * @param bitstream
   */
  setIiifStatus(bitstream: Bitstream) {

    const regexExcludeBundles = /OTHERCONTENT|THUMBNAIL|LICENSE/;
    const regexIIIFItem = /true|yes/i;

    const isImage$ = this.bitstream.format.pipe(
      getFirstSucceededRemoteData(),
      map((format: RemoteData<BitstreamFormat>) => format.payload.mimetype.includes('image/')));

    const isIIIFBundle$ = this.bitstream.bundle.pipe(
      getFirstSucceededRemoteData(),
      map((bundle: RemoteData<Bundle>) =>
        this.dsoNameService.getName(bundle.payload).match(regexExcludeBundles) == null));

    const isEnabled$ = this.bitstream.bundle.pipe(
      getFirstSucceededRemoteData(),
      map((bundle: RemoteData<Bundle>) => bundle.payload.item.pipe(
        getFirstSucceededRemoteData(),
        map((item: RemoteData<Item>) =>
          (item.payload.firstMetadataValue('dspace.iiif.enabled') &&
            item.payload.firstMetadataValue('dspace.iiif.enabled').match(regexIIIFItem) !== null),
        ))));

    const iiifSub = combineLatest(
      isImage$,
      isIIIFBundle$,
      isEnabled$,
    ).subscribe(([isImage, isIIIFBundle, isEnabled]) => {
      if (isImage && isIIIFBundle && isEnabled) {
        this.isIIIF = true;
        this.inputModels.push(this.iiifLabelModel);
        this.formModel.push(this.iiifLabelContainer);
        this.inputModels.push(this.iiifTocModel);
        this.formModel.push(this.iiifTocContainer);
        this.inputModels.push(this.iiifWidthModel);
        this.formModel.push(this.iiifWidthContainer);
        this.inputModels.push(this.iiifHeightModel);
        this.formModel.push(this.iiifHeightContainer);
      }
      this.setForm();
      this.changeDetectorRef.detectChanges();
    });

    this.subs.push(iiifSub);

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
