import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  DynamicFormControlModel, DynamicFormGroupModel, DynamicFormLayout, DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicCustomSwitchModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';

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
   * All input models in a simple array for easier iterations
   */
  inputModels = [this.fileNameModel, this.primaryBitstreamModel, this.descriptionModel, this.embargoModel];

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
    })
  ];

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
              private translate: TranslateService) {
  }

  /**
   * Initialize the component
   * - Create a FormGroup using the FormModel defined earlier
   * - Subscribe on the route data to fetch the bitstream to edit and update the form values
   * - Translate the form labels and hints
   */
  ngOnInit(): void {
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.sub = this.route.data.pipe(map((data) => data.bitstream)).subscribe((bitstreamRD) => {
      this.bitstream = bitstreamRD.payload;
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
      }
    });
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
   * Check for changes against the bitstream and send update requests to the REST API
   */
  onSubmit() {
    // TODO: Check for changes against the bitstream and send requests to the REST API accordingly
    console.log(this.formGroup.getRawValue());
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
