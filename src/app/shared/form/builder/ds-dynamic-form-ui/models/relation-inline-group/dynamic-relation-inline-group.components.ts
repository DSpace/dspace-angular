import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { of as observableOf } from 'rxjs';
import {
  DynamicFormArrayGroupModel,
  DynamicFormControlComponent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { DynamicRelationGroupModel, PLACEHOLDER_PARENT_METADATA } from '../relation-group/dynamic-relation-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionFormsModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { isEmpty, isNotEmpty } from '../../../../../empty.util';
import { shrinkInOut } from '../../../../../animations/shrink';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicRowArrayModel, DynamicRowArrayModelConfig } from '../ds-dynamic-row-array-model';
import { setLayout } from '../../../parsers/parser.utils';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ds-dynamic-relation-inline-group',
  styleUrls: ['./dynamic-relation-inline-group.component.scss'],
  templateUrl: './dynamic-relation-inline-group.component.html',
  animations: [shrinkInOut]
})
export class DsDynamicRelationInlineGroupComponent extends DynamicFormControlComponent implements OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicRelationGroupModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public formCollapsed = observableOf(false);
  public formGroup: FormGroup;
  public formModel: DynamicFormControlModel[];

  @ViewChild('formRef', {static: false}) private formRef: FormComponent;

  constructor(private authorityService: AuthorityService,
              private formBuilderService: FormBuilderService,
              private formService: FormService,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    const config = { rows: this.model.formConfiguration } as SubmissionFormsModel;

    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.initArrayModel(config);
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
  }

  initArrayModel(formConfig): DynamicRowArrayModel[] {
    let arrayCounter = 0;

    const config = {
      id: this.model.id + '_array',
      initialCount: isNotEmpty(this.model.value) ? this.model.value.length : 1,
      groupFactory: () => {
        let model;
        const fieldValue = isEmpty(this.model.value) || (arrayCounter === 0) ? {} : this.model.value[arrayCounter - 1];
        model = this.initArrayItemModel(formConfig, this.normalizeGroupFormValue(fieldValue));
        arrayCounter++;
        setLayout(model, 'element', 'host', 'col');
        if (model.hasLanguages) {
          setLayout(model, 'grid', 'control', 'col');
        }
        return [model];
      }
    } as DynamicRowArrayModelConfig;

    const layout: DynamicFormControlLayout = {
      grid: {
        group: 'form-row'
      }
    };

    return [new DynamicRowArrayModel(config, layout)];
  }

  initArrayItemModel(formConfig, initValues: any = {}) {
    const formModel = this.formBuilderService.modelFromConfiguration(
      this.model.submissionId,
      formConfig,
      this.model.scopeUUID,
      initValues,
      this.model.submissionScope,
      this.model.readOnly,
      this.formBuilderService.getTypeBindModel());

    return formModel[0];
  }

  onBlur(event: DynamicFormControlEvent) {
    this.blur.emit();
  }

  onChange(event: DynamicFormControlEvent) {
    const index = event.model.parent.parent.index;
    const groupValue = this.getRowValue(event.model.parent as DynamicFormGroupModel);

    if (this.hasEmptyGroupValue(groupValue)) {
      this.removeItemFromArray(event);
      this.removeItemFromModelValue(index);
    } else if (isEmpty(groupValue[this.model.mandatoryField])) {
      this.formService.validateAllFormFields(event.group);
    } else {
      this.updateArrayModelValue(groupValue, index);
    }
    this.change.emit();
  }

  hasEmptyGroupValue(groupValue): boolean {
    const keysNotEmpty = Object.keys(groupValue)
      .filter((metadata) => isNotEmpty(groupValue[metadata]) && groupValue[metadata] !== PLACEHOLDER_PARENT_METADATA);
    return isEmpty(keysNotEmpty);
  }

  onFocus(event: DynamicFormControlEvent) {
    this.focus.emit();
  }

  remove(event: DynamicFormControlEvent) {
    const index = event.model.parent.index;
    const size = (event.model.parent.parent as any).size;
    if (isNotEmpty(this.model.value) && size === this.model.value.length) {
      this.removeItemFromModelValue(index);
    }
  }

  private getRowValue(formGroup: DynamicFormGroupModel) {
    const groupValue = Object.create({});
    formGroup.group.forEach((model: any) => {
      groupValue[model.name] = (model.name !== this.model.mandatoryField && isEmpty(model.value)) ? PLACEHOLDER_PARENT_METADATA : model.value;
    });
    return groupValue;
  }

  private normalizeGroupFormValue(valueObj) {
    const normValue = Object.create({});
    if (isNotEmpty(valueObj)) {
      Object.keys(valueObj).forEach((metadata) => {
        if (!(valueObj[metadata] as FormFieldMetadataValueObject).hasPlaceholder()) {
          normValue[metadata] = [valueObj[metadata]];
        }
      })
    }

    return normValue
  }

  private removeItemFromModelValue(removeIndex) {
    const newValue = this.model.value.filter((value, itemIndex) => itemIndex !== removeIndex);
    this.model.valueUpdates.next(newValue);
    this.change.emit();
  }

  private removeItemFromArray(event: DynamicFormControlEvent): void {
    const parentArrayModel: DynamicFormArrayGroupModel = event.model.parent.parent as DynamicFormArrayGroupModel;
    const arraySize = parentArrayModel.parent.size;
    if (arraySize > 1) {
      const index = parentArrayModel.index;
      const arrayContext = parentArrayModel.context;
      const path = this.formBuilderService.getPath(arrayContext);
      const formArrayControl = this.formGroup.get(path) as FormArray;
      this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
      this.formService.changeForm(this.formId, this.formModel);
    }
  }

  private updateArrayModelValue(groupValue, index) {
    let modelValue = this.model.value;

    if (isEmpty(modelValue)) {
      modelValue = [groupValue];
    } else {
      modelValue[index] = groupValue;
    }
    this.model.valueUpdates.next(modelValue);
    this.change.emit();
  }

}
