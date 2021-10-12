import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicCustomSwitchModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';
import { cloneDeep } from 'lodash';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Metadata } from '../../core/shared/metadata.utils';
import { Location } from '@angular/common';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { getEntityEditRoute, getItemEditRoute } from '../../item-page/item-page-routing-paths';
import { Bundle } from '../../core/shared/bundle.model';

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

  /**
   * The bitstream's remote data observable
   * Tracks changes and updates the view
   */
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  /**
   * The formats their remote data observable
   * Tracks changes and updates the view
   */
  bitstreamFormatsRD$: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;

  /**
   * The bitstream to edit
   */
  bitstream: Bitstream;

  /**
   * The originally selected format
   */
  originalFormat: BitstreamFormat;

  /**
   * A list of all available bitstream formats
   */
  formats: BitstreamFormat[];

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
   * Options for fetching all bitstream formats
   */
  findAllOptions = { elementsPerPage: 9999 };

  /**
   * The Dynamic Input Model for the file's name
   */
  fileNameModel = new DynamicInputModel({
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
  });

  /**
   * The Dynamic TextArea Model for the file's description
   */
  descriptionModel = new DynamicTextAreaModel({
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
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.fileNameModel, this.primaryBitstreamModel, this.descriptionModel, this.selectedFormatModel, this.newFormatModel];

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
        host: 'col col-sm-4 d-inline-block switch'
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
  formGroup: FormGroup;

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
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private formService: DynamicFormService,
              private translate: TranslateService,
              private bitstreamService: BitstreamDataService,
              private notificationsService: NotificationsService,
              private bitstreamFormatService: BitstreamFormatDataService) {
  }

  /**
   * Initialize the component
   * - Create a FormGroup using the FormModel defined earlier
   * - Subscribe on the route data to fetch the bitstream to edit and update the form values
   * - Translate the form labels and hints
   */
  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);

    this.itemId = this.route.snapshot.queryParams.itemId;
    this.entityType = this.route.snapshot.queryParams.entityType;
    this.bitstreamRD$ = this.route.data.pipe(map((data) => data.bitstream));
    this.bitstreamFormatsRD$ = this.bitstreamFormatService.findAll(this.findAllOptions);

    const bitstream$ = this.bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    );

    const allFormats$ = this.bitstreamFormatsRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    );

    this.subs.push(
      observableCombineLatest(
        bitstream$,
        allFormats$
      ).subscribe(([bitstream, allFormats]) => {
        this.bitstream = bitstream as Bitstream;
        this.formats = allFormats.page;
        this.updateFormatModel();
        this.updateForm(this.bitstream);
      })
    );

    this.updateFieldTranslations();

    this.subs.push(
      this.translate.onLangChange
        .subscribe(() => {
        this.updateFieldTranslations();
      })
    );
  }

  /**
   * Update the current form values with bitstream properties
   * @param bitstream
   */
  updateForm(bitstream: Bitstream) {
    this.formGroup.patchValue({
      fileNamePrimaryContainer: {
        fileName: bitstream.name,
        primaryBitstream: false
      },
      descriptionContainer: {
        description: bitstream.firstMetadataValue('dc.description')
      },
      formatContainer: {
        newFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined
      }
    });
    this.bitstream.format.pipe(
      getAllSucceededRemoteDataPayload()
    ).subscribe((format: BitstreamFormat) => {
      this.originalFormat = format;
      this.formGroup.patchValue({
        formatContainer: {
          selectedFormat: format.id
        }
      });
      this.updateNewFormatLayout(format.id);
    });
  }

  /**
   * Create the list of unknown format IDs an add options to the selectedFormatModel
   */
  updateFormatModel() {
    this.selectedFormatModel.options = this.formats.map((format: BitstreamFormat) =>
      Object.assign({
        value: format.id,
        label: this.isUnknownFormat(format.id) ? this.translate.instant(this.KEY_PREFIX + 'selectedFormat.unknown') : format.shortDescription
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
    const format = this.formats.find((f: BitstreamFormat) => f.id === id);
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
      this.updateNewFormatLayout(model.value);
    }
  }

  /**
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    const updatedValues = this.formGroup.getRawValue();
    const updatedBitstream = this.formToBitstream(updatedValues);
    const selectedFormat = this.formats.find((f: BitstreamFormat) => f.id === updatedValues.formatContainer.selectedFormat);
    const isNewFormat = selectedFormat.id !== this.originalFormat.id;

    let bitstream$;

    if (isNewFormat) {
      bitstream$ = this.bitstreamService.updateFormat(this.bitstream, selectedFormat).pipe(
        getFirstCompletedRemoteData(),
        map((formatResponse: RemoteData<Bitstream>) => {
          if (hasValue(formatResponse) && formatResponse.hasFailed) {
            this.notificationsService.error(
              this.translate.instant(this.NOTIFICATIONS_PREFIX + 'error.format.title'),
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

    bitstream$.pipe(
      switchMap(() => {
        return this.bitstreamService.update(updatedBitstream).pipe(
          getFirstSucceededRemoteDataPayload()
        );
      })
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.notificationsService.success(
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.title'),
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.content')
      );
      this.navigateToItemEditBitstreams();
    });
  }

  /**
   * Parse form data to an updated bitstream object
   * @param rawForm   Raw form data
   */
  formToBitstream(rawForm): Bitstream {
    const updatedBitstream = cloneDeep(this.bitstream);
    const newMetadata = updatedBitstream.metadata;
    // TODO: Set bitstream to primary when supported
    const primary = rawForm.fileNamePrimaryContainer.primaryBitstream;
    Metadata.setFirstValue(newMetadata, 'dc.title', rawForm.fileNamePrimaryContainer.fileName);
    Metadata.setFirstValue(newMetadata, 'dc.description', rawForm.descriptionContainer.description);
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
    if (hasValue(this.itemId)) {
      this.router.navigate([getEntityEditRoute(this.entityType, this.itemId), 'bitstreams']);
    } else {
      this.bitstream.bundle.pipe(getFirstSucceededRemoteDataPayload(),
          mergeMap((bundle: Bundle) => bundle.item.pipe(getFirstSucceededRemoteDataPayload())))
          .subscribe((item) => {
            this.router.navigate(([getItemEditRoute(item), 'bitstreams']));
          });
    }
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
