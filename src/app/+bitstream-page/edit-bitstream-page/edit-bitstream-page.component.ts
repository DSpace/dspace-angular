import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
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
import { getRemoteDataPayload, getSucceededRemoteData } from '../../core/shared/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { RestResponse } from '../../core/cache/response.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { MetadataValue } from '../../core/shared/metadata.models';

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
    name: 'description'
  });

  /**
   * The Dynamic Input Model for the file's embargo (disabled on this page)
   */
  embargoModel = new DynamicInputModel({
    id: 'embargo',
    name: 'embargo',
    disabled: true
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
  otherFormatModel = new DynamicInputModel({
    id: 'otherFormat',
    name: 'otherFormat'
  });

  /**
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.fileNameModel, this.primaryBitstreamModel, this.descriptionModel, this.embargoModel, this.selectedFormatModel, this.otherFormatModel];

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
      id: 'embargoContainer',
      group: [
        this.embargoModel
      ]
    }),
    new DynamicFormGroupModel({
      id: 'formatContainer',
      group: [
        this.selectedFormatModel,
        this.otherFormatModel
      ]
    })
  ];

  /**
   * The base layout of the "Other Format" input
   */
  otherFormatBaseLayout = 'col col-sm-6';

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
    otherFormat: {
      grid: {
        host: this.otherFormatBaseLayout + ' d-none'
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
    embargoContainer: {
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
   * The subscription on the bitstream
   */
  sub: Subscription;

  constructor(private route: ActivatedRoute,
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

    const bitstream$ = this.route.data.pipe(map((data) => data.bitstream)).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload()
    );
    const allFormats$ = this.bitstreamFormatService.findAll(this.findAllOptions).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload()
    );

    this.sub = observableCombineLatest(
      bitstream$,
      allFormats$
    ).subscribe(([bitstream, allFormats]) => {
      this.bitstream = bitstream as Bitstream;
      this.formats = allFormats.page;
      this.updateFormatModel();
      this.updateForm(this.bitstream);
    });

    this.updateFieldTranslations();
    this.translate.onLangChange
      .subscribe(() => {
        this.updateFieldTranslations();
      });
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
        description: bitstream.description
      },
      formatContainer: {
        otherFormat: hasValue(bitstream.firstMetadata('dc.format')) ? bitstream.firstMetadata('dc.format').value : undefined
      }
    });
    this.bitstream.format.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    ).subscribe((format: BitstreamFormat) => {
      this.originalFormat = format;
      this.formGroup.patchValue({
        formatContainer: {
          selectedFormat: format.id
        }
      });
      this.updateOtherFormatLayout(format.id);
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
  updateOtherFormatLayout(selectedId: string) {
    if (this.isUnknownFormat(selectedId)) {
      this.formLayout.otherFormat.grid.host = this.otherFormatBaseLayout + ' d-inline-block';
    } else {
      this.formLayout.otherFormat.grid.host = this.otherFormatBaseLayout + ' d-none';
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
      this.updateOtherFormatLayout(model.value);
    }
  }

  /**
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    const updatedValues = this.formGroup.getRawValue();
    const newBitstream = this.formToBitstream(updatedValues);
    const selectedFormat = this.formats.find((f: BitstreamFormat) => f.id === updatedValues.formatContainer.selectedFormat);
    const isNewFormat = selectedFormat.id !== this.originalFormat.id;

    const extraOperations = [];
    if (isNewFormat) {
      const operation = Object.assign({op: 'replace', path: '/format', value: selectedFormat.self});
      extraOperations.push(operation);
    }

    const updatedBitstream$ = this.bitstreamService.update(newBitstream, extraOperations).pipe(
      tap(() => this.bitstreamService.commitUpdates()),
      getSucceededRemoteData(),
      getRemoteDataPayload()
    );

    if (isNewFormat) {
      const updatedFormatResponse$ = this.bitstreamService.updateFormat(newBitstream, selectedFormat);
      observableCombineLatest(updatedBitstream$, updatedFormatResponse$).subscribe(([bitstream, formatResponse]) => {
        this.onSuccess(bitstream, formatResponse);
      });
    } else {
      updatedBitstream$.subscribe((bitstream: Bitstream) => {
        this.onSuccess(bitstream);
      });
    }
  }

  /**
   * Display notifications and update the form upon success
   * @param bitstream
   * @param formatResponse
   */
  onSuccess(bitstream: Bitstream, formatResponse?: RestResponse) {
    this.bitstream = bitstream;
    this.updateForm(this.bitstream);
    this.notificationsService.success(
      this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.title'),
      this.translate.instant(this.NOTIFICATIONS_PREFIX + 'saved.content')
    );
  }

  /**
   * Parse form data to an updated bitstream object
   * @param rawForm   Raw form data
   */
  formToBitstream(rawForm): Bitstream {
    const newBitstream = cloneDeep(this.bitstream);
    // TODO: Set bitstream to primary when supported
    const primary = rawForm.fileNamePrimaryContainer.primaryBitstream;
    newBitstream.name = rawForm.fileNamePrimaryContainer.fileName;
    newBitstream.description = rawForm.descriptionContainer.description;

    const otherFormat = rawForm.formatContainer.otherFormat;
    if (isNotEmpty(otherFormat)) {
      const currentOtherFormat = newBitstream.firstMetadata('dc.format');
      if (hasValue(currentOtherFormat)) {
        currentOtherFormat.value = otherFormat;
      } else {
        newBitstream.metadata['dc.format'] = [Object.assign(new MetadataValue(), { value: otherFormat })];
      }
    }

    return newBitstream;
  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
