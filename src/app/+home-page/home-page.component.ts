import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicFormLayout } from '@ng-dynamic-forms/core';
import { FormComponent } from '../shared/form/form.component';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';
import { SubmissionFormsConfigService } from '../core/config/submission-forms-config.service';
import { FormService } from '../shared/form/form.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthorityOptions } from '../core/integration/models/authority-options.model';
import { DynamicScrollableDropdownModel } from '../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldMetadataValueObject } from '../shared/form/builder/models/form-field-metadata-value.model';
import { ConfidenceType } from '../core/integration/models/confidence-type';
import { Chips } from '../shared/chips/models/chips.model';
import { ChipsItem } from '../shared/chips/models/chips-item.model';
import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

export const NG_BOOTSTRAP_SAMPLE_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicFormGroupModel({

    id: 'typeGroup',
    group: [
      new DynamicScrollableDropdownModel({

        id: 'type',
        label: 'type',
        placeholder: 'Type',
        authorityOptions: new AuthorityOptions( 'type', 'dc.type', 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23')
      })
    ]
  }),

  new DynamicScrollableDropdownModel({

    id: 'dc_type',
    label: 'type',
    placeholder: 'Type',
    authorityOptions: new AuthorityOptions( 'type', 'dc.type', 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23')
  })
];

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  public formId;
  public formLayout: DynamicFormLayout = {};
  public formModel: DynamicFormControlModel[];
  public displaySubmit = false;
  public chips: Chips;

  @ViewChild('formRef') private formRef: FormComponent;
  @ViewChild('formRefTwo') private formRefTwo: FormComponent;

  constructor(@Inject(GLOBAL_CONFIG) public envConfig: GlobalConfig,
              protected cdr: ChangeDetectorRef,
              protected formBuilderService: FormBuilderService,
              protected formConfigService: SubmissionFormsConfigService,
              protected formService: FormService,
              protected store: Store<AppState>) {

  }

  ngOnInit() {

    // const collectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';
    const collectionId = 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23';
    const formId = 'traditionalpageone';

    this.formId = this.formService.getUniqueId('test');
    this.formModel = NG_BOOTSTRAP_SAMPLE_FORM_MODEL;

    const item = {
      mainField: new FormFieldMetadataValueObject('main test', null, 'test001', 'main test', 0, ConfidenceType.CF_ACCEPTED),
      relatedField: new FormFieldMetadataValueObject('related test', null, 'test002', 'related test', 0, ConfidenceType.CF_ACCEPTED),
      otherRelatedField: new FormFieldMetadataValueObject('other related test')
    };

    this.chips = new Chips([item], 'display', 'mainField', this.envConfig.submission.icons.metadata);

  }
}
